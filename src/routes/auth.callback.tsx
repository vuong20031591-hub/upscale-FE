import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "react-oidc-context";
import { useEffect } from "react";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallback,
});

function AuthCallback() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate({ to: "/", replace: true });
    }
  }, [auth.isAuthenticated, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center">
        {auth.error ? (
          <>
            <h1 className="text-xl font-semibold text-destructive">Đăng nhập thất bại</h1>
            <p className="mt-2 text-sm text-muted-foreground">{auth.error.message}</p>
            <a
              href="/"
              className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Về trang chủ
            </a>
          </>
        ) : (
          <>
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="mt-4 text-sm text-muted-foreground">Đang hoàn tất đăng nhập…</p>
          </>
        )}
      </div>
    </div>
  );
}
