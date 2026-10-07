const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

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
    // The session expired: forget the token and start over at the login page.
    localStorage.removeItem("token");
    window.location.assign("/login");
  }

  // Empty bodies (204, 401, 403) parse to null.
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || `Request failed (${response.status})`);
  }

  return data;
}
