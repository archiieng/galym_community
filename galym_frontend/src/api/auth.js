import { request } from "./client";

export async function loginUser(email, password) {
  const { token } = await request("/auth/login", {
    method: "POST",
    body: { email, password },
  });

  return token;
}

export function registerUser(name, email, password) {
  return request("/auth/register", {
    method: "POST",
    body: { name, email, password },
  });
}
