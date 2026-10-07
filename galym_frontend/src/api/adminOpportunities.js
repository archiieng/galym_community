import { request } from "./client";

export function getAdminOpportunities(status = "") {
  return request(status ? `/admin/galym?status=${status}` : "/admin/galym");
}

export function getAdminOpportunityById(id) {
  return request(`/admin/galym/${id}`);
}

export function createOpportunity(opportunity) {
  return request("/admin/galym", { method: "POST", body: opportunity });
}

export function updateOpportunity(id, opportunity) {
  return request(`/admin/galym/${id}`, { method: "PUT", body: opportunity });
}

export function deleteOpportunity(id) {
  return request(`/admin/galym/${id}`, { method: "DELETE" });
}

export function publishOpportunity(id) {
  return request(`/admin/galym/${id}/publish`, { method: "PATCH" });
}

export function unpublishOpportunity(id) {
  return request(`/admin/galym/${id}/unpublish`, { method: "PATCH" });
}
