import { request } from "./client";

export function getOpportunities(filters = {}) {
  const params = new URLSearchParams();

  // Empty filters are left out so the backend treats them as "any".
  for (const [name, value] of Object.entries(filters)) {
    if (value !== "" && value !== undefined) {
      params.append(name, value);
    }
  }

  const query = params.toString();

  return request(query ? `/galym?${query}` : "/galym");
}

export function getOpportunityById(id) {
  return request(`/galym/${id}`);
}
