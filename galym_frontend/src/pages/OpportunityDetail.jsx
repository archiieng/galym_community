import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { getOpportunityById } from "../api/opportunities";
import {
  getSavedOpportunities,
  saveOpportunity,
  unsaveOpportunity,
} from "../api/profile";
import { AuthContext } from "../context/AuthContext";
import { OPPORTUNITY_TYPES } from "../opportunityTypes";

function OpportunityDetail() {
  const { id } = useParams();
  const { token } = useContext(AuthContext);

  const [opportunity, setOpportunity] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getOpportunityById(id)
      .then(setOpportunity)
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!token) return;

    getSavedOpportunities()
      .then((list) => setSaved(list.some((item) => String(item.id) === id)))
      // Not knowing only means the button starts as "Save".
      .catch(() => {});
  }, [id, token]);

  async function handleToggleSaved() {
    try {
      await (saved ? unsaveOpportunity(id) : saveOpportunity(id));

      setSaved(!saved);
    } catch (error) {
      setError(error.message);
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!opportunity) {
    return <p className="error">{error || "Opportunity not found."}</p>;
  }

  return (
    <div>
      <Link to="/opportunities">Back</Link>

      <h1>{opportunity.title}</h1>

      {error && <p className="error">{error}</p>}

      <p>
        <strong>Type:</strong> {OPPORTUNITY_TYPES[opportunity.type]}
      </p>

      <p>
        <strong>Description:</strong> {opportunity.description}
      </p>

      <p>
        <strong>Organization:</strong> {opportunity.organizationName}
      </p>

      <p>
        <strong>Country:</strong> {opportunity.country}
      </p>

      <p>
        <strong>City:</strong> {opportunity.city}
      </p>

      <p>
        <strong>Eligibility:</strong> {opportunity.eligibility}
      </p>

      <p>
        <strong>Application instructions:</strong>{" "}
        {opportunity.applicationInstructions}
      </p>

      <p>
        <strong>Deadline:</strong> {opportunity.applicationDeadline}
      </p>

      <p>
        <strong>Funding:</strong> {opportunity.fundingInfo}
      </p>

      <p>
        <strong>Scholarship:</strong>{" "}
        {opportunity.hasScholarship ? "Yes" : "No"}
      </p>

      <div className="actions">
        {opportunity.applicationLink && (
          <a
            href={opportunity.applicationLink}
            target="_blank"
            rel="noreferrer"
          >
            Apply
          </a>
        )}

        {token ? (
          <button className="secondary" onClick={handleToggleSaved}>
            {saved ? "Saved ✓ (remove)" : "Save to profile"}
          </button>
        ) : (
          <Link to="/login">Log in to save this</Link>
        )}
      </div>
    </div>
  );
}

export default OpportunityDetail;
