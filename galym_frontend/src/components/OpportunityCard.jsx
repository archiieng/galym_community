import { Link } from "react-router-dom";
import {
  dateParts,
  daysLeft,
  daysLeftLabel,
  formatDate,
  urgency,
} from "../deadline";
import { OPPORTUNITY_TYPES } from "../opportunityTypes";
import SaveButton from "./SaveButton";

// One opportunity in a list, drawn as a ticket: the deadline is the stub.
function OpportunityCard({ opportunity }) {
  const { day, month } = dateParts(opportunity.applicationDeadline);
  const days = daysLeft(opportunity.applicationDeadline);

  return (
    <article className="ticket">
      <div className="ticket-stub">
        <span className="visually-hidden">
          Apply by {formatDate(opportunity.applicationDeadline)}
        </span>
        <span className="ticket-day" aria-hidden="true">
          {day}
        </span>
        <span className="ticket-month" aria-hidden="true">
          {month}
        </span>
        <span className={`chip chip-${urgency(days)}`}>
          {daysLeftLabel(days)}
        </span>
      </div>

      <div className="ticket-body">
        <p className="ticket-place">
          {opportunity.city}, {opportunity.country}
        </p>

        <h3 className="ticket-title">
          <Link to={`/opportunities/${opportunity.id}`}>
            {opportunity.title}
          </Link>
        </h3>

        <div className="ticket-meta">
          <span>{opportunity.organizationName}</span>

          <span className="chip">{OPPORTUNITY_TYPES[opportunity.type]}</span>

          {opportunity.hasScholarship && (
            <span className="chip chip-funded">Funded</span>
          )}
        </div>
      </div>

      <div className="ticket-aside">
        <SaveButton opportunityId={opportunity.id} />
      </div>
    </article>
  );
}

// Placeholders shown while a list of tickets is loading.
export function OpportunitySkeletons({ count = 3 }) {
  return (
    <div className="stack" aria-busy="true" aria-label="Loading opportunities">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skeleton" />
      ))}
    </div>
  );
}

export default OpportunityCard;
