import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import {
    getOpportunityById
} from "../api/opportunities";

function OpportunityDetail() {

    const { id } = useParams();

    const [opportunity, setOpportunity] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {

        async function loadOpportunity() {

            try {

                setLoading(true);

                const data =
                    await getOpportunityById(id);

                setOpportunity(data);

            } catch (error) {

                setError(error.message);

            } finally {

                setLoading(false);
            }
        }

        loadOpportunity();

    }, [id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!opportunity) {
        return <p>Opportunity not found.</p>;
    }

    return (
        <div>

            <Link to="/opportunities">
                Back
            </Link>

            <h1>
                {opportunity.title}
            </h1>

            <p>
                <strong>Type:</strong>{" "}
                {opportunity.type}
            </p>

            <p>
                <strong>Description:</strong>{" "}
                {opportunity.description}
            </p>

            <p>
                <strong>Organization:</strong>{" "}
                {opportunity.organizationName}
            </p>

            <p>
                <strong>Country:</strong>{" "}
                {opportunity.country}
            </p>

            <p>
                <strong>City:</strong>{" "}
                {opportunity.city}
            </p>

            <p>
                <strong>Eligibility:</strong>{" "}
                {opportunity.eligibility}
            </p>

            <p>
                <strong>
                    Application instructions:
                </strong>{" "}
                {opportunity.applicationInstructions}
            </p>

            <p>
                <strong>Deadline:</strong>{" "}
                {opportunity.applicationDeadline}
            </p>

            <p>
                <strong>Funding:</strong>{" "}
                {opportunity.fundingInfo}
            </p>

            <p>
                <strong>Scholarship:</strong>{" "}
                {opportunity.hasScholarship
                    ? "Yes"
                    : "No"}
            </p>

            {opportunity.applicationLink && (

                <a
                    href={opportunity.applicationLink}
                    target="_blank"
                    rel="noreferrer"
                >
                    Apply
                </a>

            )}

        </div>
    );
}

export default OpportunityDetail;