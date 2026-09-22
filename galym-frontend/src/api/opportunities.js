const BASE_URL = "http://localhost:8080";

export async function getOpportunities(filters = {}) {
    const params = new URLSearchParams();

    if (filters.type) {
        params.append("type", filters.type);
    }

    if (filters.country) {
        params.append("country", filters.country);
    }

    if (filters.city) {
        params.append("city", filters.city);
    }

    if (filters.organizationName) {
        params.append("organizationName", filters.organizationName);
    }

    if (filters.hasScholarship) {
        params.append("hasScholarship", filters.hasScholarship);
    }

    const response = await fetch(
        `${BASE_URL}/galym?${params.toString()}`
    );

    if (!response.ok) {
        throw new Error("Failed to load opportunities");
    }

    return await response.json();
}


export async function getOpportunityById(id) {
    const response = await fetch(`${BASE_URL}/galym/${id}`);

    if (!response.ok) {
        throw new Error("Opportunity not found");
    }

    return await response.json();
}