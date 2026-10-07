import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getOpportunities } from "../api/opportunities";
import OpportunityCard, {
  OpportunitySkeletons,
} from "../components/OpportunityCard";
import { OPPORTUNITY_TYPES } from "../opportunityTypes";
import { usePageTitle } from "../usePageTitle";

// The filters live in the URL (?type=SCHOLARSHIP&country=germany), so a search
// can be bookmarked, shared, and reached from links on the landing page.
function Opportunities() {
  const [searchParams, setSearchParams] = useSearchParams();

  usePageTitle("Opportunities");

  const sort = searchParams.get("sort") ?? "deadline";

  // Sorting happens here, so it is not part of what the API is asked for.
  const apiParams = new URLSearchParams(searchParams);
  apiParams.delete("sort");
  const query = apiParams.toString();

  // The list on screen, tagged with the query it answers.
  const [result, setResult] = useState({ query: null, items: [], error: "" });
  const loading = result.query !== query;

  useEffect(() => {
    let ignore = false;

    getOpportunities(Object.fromEntries(new URLSearchParams(query)))
      .then((items) => {
        if (!ignore) setResult({ query, items, error: "" });
      })
      .catch((error) => {
        if (!ignore) setResult({ query, items: [], error: error.message });
      });

    // A slower, older request must not overwrite a newer one.
    return () => {
      ignore = true;
    };
  }, [query]);

  // The API already returns the soonest deadline first.
  const items =
    sort === "newest"
      ? result.items.toSorted((a, b) => b.createdAt.localeCompare(a.createdAt))
      : result.items;

  function handleSearch(e) {
    e.preventDefault();

    const next = new URLSearchParams();

    for (const [name, value] of new FormData(e.target)) {
      if (value.trim()) next.set(name, value.trim());
    }
    if (sort !== "deadline") next.set("sort", sort);

    setSearchParams(next);
  }

  function handleSort(e) {
    const next = new URLSearchParams(searchParams);

    if (e.target.value === "deadline") next.delete("sort");
    else next.set("sort", e.target.value);

    setSearchParams(next, { replace: true });
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Opportunities</h1>
          <p>
            Open scholarships, internships, research and exchange programmes.
          </p>
        </div>
      </div>

      {/* key: when the URL changes elsewhere, the fields pick up the new values */}
      <form
        key={query}
        className="filters"
        role="search"
        onSubmit={handleSearch}
      >
        <div className="field">
          <label htmlFor="q">Keyword</label>
          <input
            id="q"
            name="q"
            type="search"
            placeholder="Title, organisation, country..."
            defaultValue={searchParams.get("q") ?? ""}
          />
        </div>

        <div className="field">
          <label htmlFor="type">Type</label>
          <select
            id="type"
            name="type"
            defaultValue={searchParams.get("type") ?? ""}
          >
            <option value="">Any type</option>
            {Object.entries(OPPORTUNITY_TYPES).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="country">Country</label>
          <input
            id="country"
            name="country"
            type="text"
            defaultValue={searchParams.get("country") ?? ""}
          />
        </div>

        <div className="field">
          <label htmlFor="city">City</label>
          <input
            id="city"
            name="city"
            type="text"
            defaultValue={searchParams.get("city") ?? ""}
          />
        </div>

        <div className="field">
          <label htmlFor="hasScholarship">Funding</label>
          <select
            id="hasScholarship"
            name="hasScholarship"
            defaultValue={searchParams.get("hasScholarship") ?? ""}
          >
            <option value="">Any</option>
            <option value="true">Funded</option>
            <option value="false">Not funded</option>
          </select>
        </div>

        <div className="filters-actions">
          <button type="submit" className="btn">
            Search
          </button>

          {query && <Link to="/opportunities">Clear filters</Link>}

          <div className="field">
            <label htmlFor="sort">Sort by</label>
            <select id="sort" value={sort} onChange={handleSort}>
              <option value="deadline">Deadline, soonest first</option>
              <option value="newest">Recently added</option>
            </select>
          </div>
        </div>
      </form>

      {loading ? (
        <OpportunitySkeletons count={4} />
      ) : result.error ? (
        <p className="notice notice-error" role="alert">
          The list could not be loaded: {result.error}
        </p>
      ) : items.length === 0 ? (
        <div className="empty">
          <p>No open opportunities match this search.</p>
          {query && (
            <p>
              <Link to="/opportunities">Clear the filters</Link> to see
              everything.
            </p>
          )}
        </div>
      ) : (
        <>
          <p className="muted" role="status" style={{ marginBottom: 12 }}>
            {items.length === 1
              ? "1 opportunity"
              : `${items.length} opportunities`}
          </p>

          <div className="stack">
            {items.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        </>
      )}
    </>
  );
}

export default Opportunities;
