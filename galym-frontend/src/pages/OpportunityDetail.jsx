import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getOpportunityById } from "../api/opportunities";

function OpportunityDetail() {
    const { id } = useParams();

    const [opportunity, setOpportunity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadOpportunity() {
            try {
                const data = await getOpportunityById(id);

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
        return <p>Loading opportunity...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>{opportunity.title}</h1>

            <p>
                Type: {opportunity.type}
            </p>

            <p>
                Organization: {opportunity.organizationName}
            </p>

            <p>
                Location: {opportunity.city}, {opportunity.country}
            </p>

            <p>
                Deadline: {opportunity.applicationDeadline}
            </p>

            <h3>Description</h3>
            <p>{opportunity.description}</p>

            <h3>Eligibility</h3>
            <p>{opportunity.eligibility}</p>

            <h3>Application Instructions</h3>
            <p>{opportunity.applicationInstructions}</p>

            <h3>Funding Information</h3>
            <p>{opportunity.fundingInfo}</p>

            {opportunity.hasScholarship && (
                <p>Scholarship available</p>
            )}

            <a
                href={opportunity.applicationLink}
                target="_blank"
                rel="noopener noreferrer"
            >
                Apply
            </a>
        </div>
    );
}

export default OpportunityDetail;