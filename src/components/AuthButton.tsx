import { useAuth } from "react-oidc-context";
import { COGNITO_DOMAIN } from "@/lib/auth-config";

export function AuthButton() {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <div className="h-9 w-24 animate-pulse rounded-md bg-muted" aria-label="Đang tải" />
    );
  }

  if (auth.isAuthenticated) {
    const email = auth.user?.profile.email ?? "Đã đăng nhập";
    return (
      <div className="flex items-center gap-2">
        <span className="hidden text-sm text-muted-foreground sm:inline">{email}</span>
        <button
          type="button"
          onClick={() => {
            // Local sign-out first
            void auth.removeUser();
            // Optional full Cognito Hosted UI logout
            if (COGNITO_DOMAIN) {
              const clientId = auth.settings.client_id;
              const logoutUri = encodeURIComponent(window.location.origin);
              window.location.href = `${COGNITO_DOMAIN}/logout?client_id=${clientId}&logout_uri=${logoutUri}`;
            }
          }}
          className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent"
        >
          Đăng xuất
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => void auth.signinRedirect()}
      className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
    >
      Đăng nhập
    </button>
  );
}
