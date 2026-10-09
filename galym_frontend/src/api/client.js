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
  const pathname = path.split("?")[0].replace(/\/+$/, "");
  const token = ["/auth/login", "/auth/register"].includes(pathname)
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

  const responseBody = await response.text();
  let data = null;
  if (responseBody) {
    try {
      data = JSON.parse(responseBody);
    } catch {
      data = responseBody;
    }
  }

  if (!response.ok) {
    const sessionExpired = response.status === 401 && token;
    // An old request must not sign out a newer session.
    if (sessionExpired && localStorage.getItem("token") === token) {
      window.dispatchEvent(new Event(SESSION_EXPIRED));
    }
    const error = new Error(
      sessionExpired
        ? "Your session has ended. Log in again to continue."
        : data?.message || `Request failed (${response.status}) for ${path}`,
    );
    error.path = path;
    error.status = response.status;
    error.body = data;
    error.responseBody = responseBody;
    throw error;
  }

  return data;
}
