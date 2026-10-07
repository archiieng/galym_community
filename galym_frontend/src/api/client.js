// `||` rather than `??` so a blank value falls back too; a trailing slash would
// produce "//path" URLs, which the backend's firewall rejects.
const BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8080"
).replace(/\/+$/, "");

// Fired when the server stops accepting the stored token. AuthProvider listens
// and signs the user out; nothing here decides where the user should go.
export const SESSION_EXPIRED = "galym:session-expired";

// The one place that talks to the backend: adds the token, parses JSON and
// turns error responses into Error objects carrying the server's message.
export async function request(path, { method = "GET", body } = {}) {
  const token = path.startsWith("/auth/")
    ? null
    : localStorage.getItem("token");

  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(BASE_URL + path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (response.status === 401 && token) {
    window.dispatchEvent(new Event(SESSION_EXPIRED));
    throw new Error("Your session has ended. Log in again to continue.");
  }

  // Empty bodies (204, 403) parse to null.
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || `Request failed (${response.status})`);
  }

  return data;
}
