
## Bối cảnh phân tích codebase BE hiện tại

Đã phân tích `vuong20031591-hub/upscale-BE@main` qua GitHub API:

**Đã có sẵn:**
- FastAPI 0.109 + Uvicorn, factory pattern trong `app/main.py`
- Routers: `health`, `upscale_basic`, `upscale_face`, `upscale_smart`, `upscale_stream` (SSE)
- `app/core/config.py`: config dạng dataclass đọc từ env (API/CORS/Upload/Model/Smart)
- `app/middleware/rate_limiter.py`: rate limit in-memory (per-IP, X-Forwarded-For + trusted proxies)
- `app/services/*`: Real-ESRGAN + CodeFormer + smart analyzer + `upscale_job_processor` (đã có khái niệm "job" cho SSE, nhưng in-process)
- `app/routers/health.py`: đã có `/health`, `/health/ready`, `/health/config`, `/health/metrics` (Prometheus)
- `sse-starlette`, `prometheus-client`, structured logging (`app/utils/logging_utils.py`)
- Sprint 1 vừa push: `Dockerfile` (CUDA 12.1 + Torch 2.3.1), `docker-compose.yml`, `.github/workflows/ci.yml`

**Vấn đề / gap cần xử lý:**
- **Repo bẩn**: `.env` (chứa secrets thật) + `.coverage` + `.hypothesis/` + `__pycache__/` được commit. `.gitignore` không đủ mạnh.
- **Torch mismatch**: `requirements.txt` pin `torch==2.4.1 cu124`, Dockerfile Sprint 1 dùng `2.3.1 cu121` → build sẽ fail. Cần align: đổi base image → `cuda:12.4.1` và giữ Torch 2.4.1.
- **`@app.on_event("startup")` deprecated** trong FastAPI mới → dùng `lifespan`.
- **Không có auth, không có DB, không có S3/SQS**. Job xử lý inline trong process → không scale, mất khi crash.
- **Không có Alembic**, không có model user/job/quota.
- Free/Pro tier chưa có; rate limit hiện tại chỉ per-IP.

Toàn bộ thay đổi push qua GitHub API với author `Nguyễn Tiến Vương <vuong20031591@gmail.com>`.

---

## Sprint 1 — Hoàn thiện Infra (đã push 3/7 files)

Còn thiếu:
1. `.gitignore` chuẩn Python (loại `.env`, `.coverage`, `.hypothesis/`, `__pycache__/`, `weights/`, `tmp/`, `output/`, `logs/`).
2. **Xóa `.env` khỏi tracking** (giữ `.env.example`). Cảnh báo user rotate mọi secret đã lộ.
3. `.dockerignore` — loại tests, weights, .git, .hypothesis khỏi build context.
4. `Makefile` — `build / up / down / logs / test / lint / fmt / shell`.
5. Sửa `Dockerfile`: base `nvidia/cuda:12.4.1-cudnn-runtime-ubuntu22.04`, cài `torch==2.4.1+cu124` đúng như `requirements.txt`.
6. Sửa `app/main.py`: `@app.on_event` → `lifespan` context manager.
7. Packer template `packer/upscale-ami.pkr.hcl` (bake AMI: NVIDIA driver + Docker + nvidia-container-toolkit + pre-pulled image + pre-downloaded weights). Kèm `packer/README.md`.

## Sprint 2 — Auth (Cognito) trên BE

1. Thêm deps: `PyJWT[crypto]`, `cachetools`, `boto3` vào `requirements.txt`.
2. Config mới trong `app/core/config.py`: `CognitoConfig` (`user_pool_id`, `region`, `client_id`, `jwks_url` derive).
3. `app/middleware/auth.py`:
   - Fetch JWKS 1 lần, cache TTL 1h.
   - `verify_token(token)` verify `iss`, `aud` (client_id), `token_use=access`, `exp`, signature.
   - FastAPI dependency `get_current_user()` → trả `{sub, email, tier}` (tier đọc từ custom claim `custom:tier` fallback `free`).
4. `app/routers/auth.py` (optional helper): `GET /auth/me` để FE test.
5. Apply `Depends(get_current_user)` cho tất cả router `/upscale/*`.
6. Update `.env.example`: `COGNITO_USER_POOL_ID`, `COGNITO_REGION`, `COGNITO_CLIENT_ID`.
7. Tests: `tests/test_auth.py` mock JWKS bằng `moto`/keypair local.

## Sprint 3 — Database (RDS Postgres) + Quota

1. Deps: `sqlalchemy[asyncio]==2.0.*`, `asyncpg`, `alembic`, `pydantic-settings`.
2. `app/db/session.py`: async engine + `AsyncSession` factory + `get_db` dependency.
3. `app/models/orm/`:
   - `User(id=cognito_sub, email, tier ENUM('free','pro'), created_at)`
   - `Job(id UUID, user_id, status ENUM queued/processing/succeeded/failed, mode, input_key, output_key, error, created_at, finished_at)`
   - `UsageQuota(user_id, period_start, jobs_used)` — reset hàng ngày (free) / hàng tháng (pro).
4. `alembic/` init + migration `0001_initial`.
5. `app/services/quota.py`: `check_and_consume(user, tier)` — free: N/ngày, pro: M/tháng (config qua env).
6. `app/middleware/quota.py` hoặc dependency: gắn vào các endpoint `/upscale/*`.
7. `app/routers/jobs.py`: `GET /jobs/{id}`, `GET /jobs?mine=1`.
8. Update `docker-compose.yml`: thêm service `postgres:16` cho dev local.
9. Update `README.md` mục "Local dev với DB".

## Sprint 4 — Async pipeline (S3 + SQS + Worker)

1. Deps đã có `boto3`. Config `S3Config` (`bucket`, `region`), `SQSConfig` (`queue_url`, `dlq_url`).
2. `app/services/storage.py`: `presign_put(key)`, `presign_get(key)`, `head(key)`.
3. `app/routers/uploads.py`: `POST /uploads/presign` → trả `{url, fields, key}` (dùng `sub` + uuid làm key prefix).
4. `app/routers/jobs.py` mở rộng: `POST /jobs` body `{mode, input_key, params}` → tạo row `queued`, `SendMessage` SQS, trả `job_id`.
5. `worker/worker.py` (entry point riêng, cùng image Docker, chạy `python -m worker`):
   - Long-poll SQS, `ChangeMessageVisibility` khi cần.
   - Download từ S3 → gọi `SmartProcessor`/`FaceEnhancementService` (tái dùng service hiện có) → upload S3.
   - Update Job status + `output_key`; xóa message; failure → retry ≤3 rồi DLQ.
6. `docker-compose.yml`: thêm service `worker` share GPU với `api`.
7. Legacy inline endpoints `/upscale/*` giữ nguyên (backwards-compat) nhưng thêm header deprecation; FE nên chuyển sang flow presign + `/jobs`.
8. `.github/workflows/ci.yml`: thêm bước build & test worker.

## Sprint 5 — Observability

1. `app/core/logging.py`: cấu hình JSON logger toàn cục, inject `request_id` (middleware sinh UUID nếu client không gửi `X-Request-ID`).
2. `app/middleware/request_id.py`.
3. Prometheus metrics bổ sung: `job_duration_seconds`, `job_status_total`, `gpu_memory_bytes`, `queue_depth` (worker publish).
4. Sentry: `sentry-sdk[fastapi]`; init trong `main.py` nếu `SENTRY_DSN` có.
5. CloudWatch: tuỳ chọn — log driver `awslogs` trong compose/prod, không cần code.
6. `README.md` mục "Observability".

## Sprint 6 — Hardening

1. **Per-user rate limit**: mở rộng `RateLimiter` để nhận `user_id` từ dependency (khi có auth) thay per-IP; fallback IP cho endpoint public.
2. SQS retry policy + DLQ alarm (Terraform snippet trong `infra/`).
3. RDS backup: `infra/rds.tf` snippet (retention 7 ngày, PITR).
4. S3 lifecycle: `input/` xóa sau 24h, `output/` xóa sau 30 ngày.
5. Security scan CI: `pip-audit`, `bandit`, `trivy` image scan trong `ci.yml`.
6. Load test script `scripts/loadtest.py` (locust hoặc httpx concurrent).
7. `SECURITY.md`, `RUNBOOK.md`.

---

## Kỹ thuật thi hành

- Mọi commit qua GitHub Contents API (`PUT /repos/.../contents/{path}`), author = `vuong20031591-hub`.
- Mỗi sprint = 1 loạt commit nhỏ, có message dạng `sprint-N: <scope>`.
- Không thể chạy test Python trong Lovable sandbox (không có GPU/CUDA); test được verify qua CI GitHub Actions sau khi push.
- FE cần cập nhật song song ở Sprint 2 (attach Bearer token), Sprint 4 (presign + poll `/jobs/{id}`); mình sẽ làm ở project FE này.
- Trước khi bắt đầu Sprint 2 cần user cung cấp: `COGNITO_USER_POOL_ID`, `COGNITO_CLIENT_ID`, region (spec nói `ap-southeast-1`).

## ASCII overview

```text
Sprint 1  Infra hardening  ──►  Docker build xanh, .env sạch, Packer AMI
Sprint 2  Auth (Cognito)   ──►  JWKS verify, tier claim, /auth/me
Sprint 3  DB + Quota       ──►  RDS + Alembic, users/jobs/quota, /jobs list
Sprint 4  Async pipeline   ──►  S3 presign, SQS enqueue, worker consume
Sprint 5  Observability    ──►  JSON log + request_id, metrics, Sentry
Sprint 6  Hardening        ──►  per-user RL, DLQ, backup, S3 lifecycle, scans
```

Approve plan này để mình bắt đầu **Sprint 1 remainder** (7 file/edit ở trên).
