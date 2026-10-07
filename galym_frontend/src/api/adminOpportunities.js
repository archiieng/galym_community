const BASE_URL = "http://localhost:8080";

function getToken() {
    return localStorage.getItem("token");
}

function getHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    };
}

export async function getAdminOpportunities(status = "") {
    let url = `${BASE_URL}/admin/galym`;
    if (status) {
        url += `?status=${status}`;
    }
    const response = await fetch(url, { headers: getHeaders() });
    if (!response.ok) throw new Error("Failed to load admin opportunities");
    return response.json();
}

export async function getAdminOpportunityById(id) {
    const response = await fetch(`${BASE_URL}/admin/galym/${id}`, { headers: getHeaders() });
    if (!response.ok) throw new Error("Failed to load opportunity");
    return response.json();
}

export async function createOpportunity(opportunity) {
    const response = await fetch(`${BASE_URL}/admin/galym`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(opportunity)
    });
    if (!response.ok) throw new Error("Failed to create opportunity");
    return response.json();
}

export async function updateOpportunity(id, opportunity) {
    const response = await fetch(`${BASE_URL}/admin/galym/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(opportunity)
    });
    if (!response.ok) throw new Error("Failed to update opportunity");
    return response.json();
}

export async function deleteOpportunity(id) {
    const response = await fetch(`${BASE_URL}/admin/galym/${id}`, {
        method: "DELETE",
        headers: getHeaders()
    });
    if (!response.ok) throw new Error("Failed to delete opportunity");
}

export async function publishOpportunity(id) {
    const response = await fetch(`${BASE_URL}/admin/galym/${id}/publish`, {
        method: "PATCH",
        headers: getHeaders()
    });
    if (!response.ok) throw new Error("Failed to publish opportunity");
    return response.json();
}

export async function unpublishOpportunity(id) {
    const response = await fetch(`${BASE_URL}/admin/galym/${id}/unpublish`, {
        method: "PATCH",
        headers: getHeaders()
    });
    if (!response.ok) throw new Error("Failed to unpublish opportunity");
    return response.json();
}