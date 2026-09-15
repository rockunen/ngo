import { NextRequest } from "next/server";

/**
 * Validates whether an incoming request comes from an authorized origin.
 * Prevents unauthorized cross-site requests while allowing:
 * 1. All development mode requests (localhost, 127.0.0.1, custom ports)
 * 2. Requests without an Origin header (server-to-server)
 * 3. Same-origin requests (where origin matches the request host)
 * 4. All Vercel deployments (*.vercel.app)
 * 5. Configured NEXT_PUBLIC_APP_URL
 */
export function isRequestAllowed(request: NextRequest): boolean {
  // Always allow in development mode
  if (process.env.NODE_ENV === "development") {
    return true;
  }

  const origin = request.headers.get("origin");

  // Allow requests without Origin header (e.g. direct server-to-server)
  if (!origin) {
    return true;
  }

  // Allow same-origin requests (e.g., frontend calling API on the same domain)
  const host = request.headers.get("host");
  if (host && (origin.includes(host) || host.includes(origin.replace(/^https?:\/\//, "")))) {
    return true;
  }

  // Allow all Vercel domains (preview and production)
  if (origin.endsWith(".vercel.app") || origin.includes("vercel.app")) {
    return true;
  }

  // Allow configured APP URL
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl && (origin === appUrl || appUrl.includes(origin))) {
    return true;
  }

  // Allow common local dev hosts
  if (
    origin.startsWith("http://localhost:") ||
    origin.startsWith("http://127.0.0.1:")
  ) {
    return true;
  }

  return false;
}
