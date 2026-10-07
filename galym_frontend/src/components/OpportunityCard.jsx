import { Link } from "react-router-dom";
import { OPPORTUNITY_TYPES } from "../opportunityTypes";

// One opportunity in a list. Extra actions (Remove, ...) go in as children.
function OpportunityCard({ opportunity, children }) {
  return (
    <div className="card">
      <h2>{opportunity.title}</h2>

      <p>
        {OPPORTUNITY_TYPES[opportunity.type]} · {opportunity.organizationName}
      </p>

      <p>
        {opportunity.city}, {opportunity.country} · Deadline:{" "}
        {opportunity.applicationDeadline}
      </p>

      {opportunity.hasScholarship && (
        <p className="tag">Scholarship available</p>
      )}

      <div className="actions">
        <Link to={`/opportunities/${opportunity.id}`}>View Details</Link>

        {children}
      </div>
    </div>
  );
}

export default OpportunityCard;
