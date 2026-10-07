import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getOpportunities } from "../api/opportunities";
import OpportunityCard, {
  OpportunitySkeletons,
} from "../components/OpportunityCard";
import { AuthContext } from "../context/AuthContext";
import { OPPORTUNITY_TYPES } from "../opportunityTypes";
import { usePageTitle } from "../usePageTitle";

const SHOWN = 3;

function Home() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  usePageTitle();

  // null while loading; [] if the API could not be reached.
  const [opportunities, setOpportunities] = useState(null);

  useEffect(() => {
    // ponytail: loads every published opportunity and derives the three lists
    // below from it; give the API sort + limit once the list is long enough
    // to notice.
    getOpportunities()
      .then(setOpportunities)
      // The landing page still makes sense without live data.
      .catch(() => setOpportunities([]));
  }, []);

  // The API returns them soonest deadline first.
  const closingSoon = opportunities?.slice(0, SHOWN);
  // Newest first, minus the ones already shown above, so nothing is listed twice.
  const recent = opportunities
    ?.filter((opportunity) => !closingSoon.includes(opportunity))
    .toSorted((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, SHOWN);

  function countOf(type) {
    return opportunities?.filter((o) => o.type === type).length ?? 0;
  }

  function handleSearch(e) {
    e.preventDefault();

    const q = new FormData(e.target).get("q").trim();

    navigate(
      q ? `/opportunities?q=${encodeURIComponent(q)}` : "/opportunities",
    );
  }

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <h1>
            Scholarships, internships and exchanges, with the time you have left
            to apply
          </h1>

          <p className="hero-lead">
            Galym gathers study and work opportunities for students in one list,
            sorted by deadline, so the good ones stop slipping past.
          </p>

          <form className="hero-search" role="search" onSubmit={handleSearch}>
            <label htmlFor="hero-q" className="visually-hidden">
              Search opportunities
            </label>
            <input
              id="hero-q"
              name="q"
              type="search"
              placeholder="Try “Germany” or “internship”"
            />
            <button type="submit" className="btn">
              Search
            </button>
          </form>

          <p className="hero-links">
            <Link to="/opportunities">Browse everything</Link>
            {!token && (
              <>
                {" or "}
                <Link to="/register">create an account</Link> to save the ones
                you like.
              </>
            )}
          </p>
        </div>

        <div className="hero-board">
          <h2>Closing soonest</h2>

          {!closingSoon ? (
            <OpportunitySkeletons />
          ) : closingSoon.length === 0 ? (
            <p className="empty">Nothing is open right now. Check back soon.</p>
          ) : (
            <div className="stack">
              {closingSoon.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section" aria-labelledby="types-title">
        <h2 id="types-title">Browse by type</h2>

        <ul className="types">
          {Object.entries(OPPORTUNITY_TYPES).map(([type, label]) => (
            <li key={type}>
              <Link to={`/opportunities?type=${type}`}>
                {label}
                <span>
                  {countOf(type)}
                  <span className="visually-hidden"> open</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {recent?.length > 0 && (
        <section className="section" aria-labelledby="recent-title">
          <h2 id="recent-title">Recently added</h2>

          <div className="stack">
            {recent.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        </section>
      )}

      <section className="section" aria-labelledby="how-title">
        <h2 id="how-title">How it works</h2>

        <ol className="steps">
          <li>
            <h3>Find what fits</h3>
            <p>
              Search by country, type or keyword. Every listing shows who it is
              for, what it pays for and how to apply.
            </p>
          </li>
          <li>
            <h3>Save it to your profile</h3>
            <p>
              Saved opportunities stay in one place with their deadlines, so you
              can come back when your documents are ready.
            </p>
          </li>
          <li>
            <h3>Apply before it closes</h3>
            <p>
              Each listing links to the organiser&rsquo;s official page. The
              days-left counter tells you how long you have.
            </p>
          </li>
        </ol>
      </section>
    </>
  );
}

export default Home;
