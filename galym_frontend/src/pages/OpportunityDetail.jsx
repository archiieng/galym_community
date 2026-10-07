import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { getOpportunityById } from "../api/opportunities";
import SaveButton from "../components/SaveButton";
import {
  dateParts,
  daysLeft,
  daysLeftLabel,
  formatDate,
  urgency,
} from "../deadline";
import { OPPORTUNITY_TYPES } from "../opportunityTypes";
import { usePageTitle } from "../usePageTitle";

function OpportunityDetail() {
  const { id } = useParams();

  // The opportunity on screen, tagged with the id it was loaded for.
  const [result, setResult] = useState({ id: null, opportunity: null });
  const loading = result.id !== id;
  const { opportunity, error } = result;

  usePageTitle(opportunity?.title ?? "Opportunity");

  useEffect(() => {
    let ignore = false;

    getOpportunityById(id)
      .then((opportunity) => {
        if (!ignore) setResult({ id, opportunity });
      })
      .catch((error) => {
        if (!ignore) setResult({ id, opportunity: null, error: error.message });
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) {
    return <p className="muted">Loading...</p>;
  }

  if (!opportunity) {
    return (
      <div className="empty" role="alert">
        <p>This opportunity could not be opened. It may have been removed.</p>
        <p className="muted">{error}</p>
        <p>
          <Link to="/opportunities">Back to all opportunities</Link>
        </p>
      </div>
    );
  }

  const days = daysLeft(opportunity.applicationDeadline);
  const { day, month, year } = dateParts(opportunity.applicationDeadline);

  return (
    <div className="detail">
      <article>
        <header className="detail-head">
          <p>
            <Link to="/opportunities">All opportunities</Link>
          </p>

          <h1>{opportunity.title}</h1>

          <div className="ticket-meta">
            <span className="ticket-place">
              {opportunity.city}, {opportunity.country}
            </span>
            <span>{opportunity.organizationName}</span>
            <span className="chip">{OPPORTUNITY_TYPES[opportunity.type]}</span>
            {opportunity.hasScholarship && (
              <span className="chip chip-funded">Funded</span>
            )}
          </div>
        </header>

        <div className="detail-body prose">
          <section>
            <h2>About</h2>
            <p>{opportunity.description}</p>
          </section>

          <section>
            <h2>Who can apply</h2>
            <p>{opportunity.eligibility}</p>
          </section>

          <section>
            <h2>How to apply</h2>
            <p>{opportunity.applicationInstructions}</p>
          </section>

          <section>
            <h2>Funding</h2>
            <p>{opportunity.fundingInfo}</p>
          </section>
        </div>
      </article>

      <aside>
        <div className="deadline-panel">
          <div>
            <p className="field-label muted">Apply by</p>
            <p>
              <span className="ticket-day">{day}</span> {month} {year}
              <span className="visually-hidden">
                {" "}
                ({formatDate(opportunity.applicationDeadline)})
              </span>
            </p>
          </div>

          <p>
            <span className={`chip chip-${urgency(days)}`}>
              {daysLeftLabel(days)}
            </span>
          </p>

          <hr className="deadline-rule" />

          {opportunity.applicationLink && (
            <a
              className="btn"
              href={opportunity.applicationLink}
              target="_blank"
              rel="noreferrer"
            >
              Apply on the official site
            </a>
          )}

          <SaveButton
            opportunityId={opportunity.id}
            className="btn btn-secondary"
          />
        </div>
      </aside>
    </div>
  );
}

export default OpportunityDetail;
