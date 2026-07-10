/**
 * Client-only wrapper around react-oidc-context's AuthProvider.
 * `oidc-client-ts` touches window/localStorage during UserManager
 * construction, so it must never run during SSR.
 */
import { useHydrated } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { AuthProvider } from "react-oidc-context";
import { cognitoAuthConfig } from "@/lib/auth-config";

export function AuthClientProvider({ children }: { children: ReactNode }) {
  const hydrated = useHydrated();
  if (!hydrated) return <>{children}</>;
  return <AuthProvider {...cognitoAuthConfig}>{children}</AuthProvider>;
}
