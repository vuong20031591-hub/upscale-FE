import { AUTH_STORAGE_KEY } from "./auth-config";

/**
 * Read the current access token from the oidc-client-ts store.
 * Works outside React (used by `src/lib/api.ts` in xhr callbacks).
 * Returns null when not signed in or during SSR.
 */
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      access_token?: string;
      id_token?: string;
      expires_at?: number;
    };
    if (parsed.expires_at && parsed.expires_at * 1000 < Date.now()) return null;
    return parsed.access_token ?? null;
  } catch {
    return null;
  }
}

export function getIdToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { id_token?: string; expires_at?: number };
    if (parsed.expires_at && parsed.expires_at * 1000 < Date.now()) return null;
    return parsed.id_token ?? null;
  } catch {
    return null;
  }
}
