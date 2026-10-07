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
        params.append(
            "organizationName",
            filters.organizationName
        );
    }

    if (
        filters.hasScholarship !== "" &&
        filters.hasScholarship !== undefined
    ) {
        params.append(
            "hasScholarship",
            filters.hasScholarship
        );
    }

    const query = params.toString();

    const url = query
        ? `${BASE_URL}/galym?${query}`
        : `${BASE_URL}/galym`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to load opportunities");
    }

    return response.json();
}

export async function getOpportunityById(id) {

    const response = await fetch(
        `${BASE_URL}/galym/${id}`
    );

    if (!response.ok) {
        throw new Error("Opportunity not found");
    }

    return response.json();
}