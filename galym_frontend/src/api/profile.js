import { request } from "./client";

export function getMe() {
  return request("/users/me");
}

export function updateProfile(name) {
  return request("/users/me", { method: "PATCH", body: { name } });
}

export function changePassword(currentPassword, newPassword) {
  return request("/users/me/password", {
    method: "PUT",
    body: { currentPassword, newPassword },
  });
}

export function getSavedOpportunities() {
  return request("/users/me/saved");
}

export function saveOpportunity(id) {
  return request(`/users/me/saved/${id}`, { method: "PUT" });
}

export function unsaveOpportunity(id) {
  return request(`/users/me/saved/${id}`, { method: "DELETE" });
}
