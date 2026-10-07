import { request } from "./client";

export function getMe() {
  return request("/users/me");
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
