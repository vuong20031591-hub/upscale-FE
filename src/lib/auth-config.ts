/**
 * AWS Cognito OIDC configuration.
 * Values come from Vite env vars (public — no secret).
 * Defaults point at the project's dev pool so `bun dev` works out of the box.
 */
import type { AuthProviderProps } from "react-oidc-context";
import { WebStorageStateStore } from "oidc-client-ts";

const AUTHORITY =
  import.meta.env.VITE_COGNITO_AUTHORITY ??
  "https://cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_yMHGGcfAO";

const CLIENT_ID =
  import.meta.env.VITE_COGNITO_CLIENT_ID ?? "76irjqk5s74o350mondlk86vj6";

const REDIRECT_URI =
  import.meta.env.VITE_COGNITO_REDIRECT_URI ??
  (typeof window !== "undefined"
    ? `${window.location.origin}/auth/callback`
    : "http://localhost:8080/auth/callback");

const POST_LOGOUT_REDIRECT_URI =
  import.meta.env.VITE_COGNITO_LOGOUT_URI ??
  (typeof window !== "undefined" ? window.location.origin : "http://localhost:8080");

// Cognito Hosted UI domain (only needed for full logout redirect)
export const COGNITO_DOMAIN =
  import.meta.env.VITE_COGNITO_DOMAIN ?? ""; // e.g. https://upscale-fe.auth.ap-southeast-1.amazoncognito.com

export const cognitoAuthConfig: AuthProviderProps = {
  authority: AUTHORITY,
  client_id: CLIENT_ID,
  redirect_uri: REDIRECT_URI,
  post_logout_redirect_uri: POST_LOGOUT_REDIRECT_URI,
  response_type: "code",
  scope: "openid email profile",
  // Persist across full page reloads (default is sessionStorage)
  userStore:
    typeof window !== "undefined"
      ? new WebStorageStateStore({ store: window.localStorage })
      : undefined,
  // Clean the ?code=&state= from the URL after callback
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};

export const AUTH_STORAGE_KEY = `oidc.user:${AUTHORITY}:${CLIENT_ID}`;
