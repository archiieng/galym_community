import { request } from "./client";

export function getUsers() {
  return request("/admin/user");
}

export function changeUserRole(id, role) {
  return request(`/admin/user/${id}/role`, { method: "PATCH", body: { role } });
}

export function deleteUser(id) {
  return request(`/admin/user/${id}`, { method: "DELETE" });
}
