import { useEffect, useState } from "react";
import { getOpportunities } from "../api/opportunities";
import OpportunityCard from "../components/OpportunityCard";
import { OPPORTUNITY_TYPES } from "../opportunityTypes";

function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [type, setType] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [hasScholarship, setHasScholarship] = useState("");

  async function loadOpportunities(filters = {}) {
    try {
      setLoading(true);
      setError("");

      const data = await getOpportunities(filters);

      setOpportunities(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getOpportunities()
      .then(setOpportunities)
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, []);

  function handleSearch(e) {
    e.preventDefault();

    loadOpportunities({
      type,
      country,
      city,
      organizationName,
      hasScholarship,
    });
  }

  return (
    <div>
      <h1>Opportunities</h1>

      <form className="filters" onSubmit={handleSearch}>
        <div>
          <label htmlFor="type">Type</label>

          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">All</option>
            {Object.entries(OPPORTUNITY_TYPES).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="country">Country</label>

          <input
            id="country"
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="city">City</label>

          <input
            id="city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="organizationName">Organization</label>

          <input
            id="organizationName"
            type="text"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="hasScholarship">Scholarship</label>

          <select
            id="hasScholarship"
            value={hasScholarship}
            onChange={(e) => setHasScholarship(e.target.value)}
          >
            <option value="">All</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          Search
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Loading opportunities...</p>
      ) : (
        !error &&
        (opportunities.length === 0 ? (
          <p>No opportunities match these filters.</p>
        ) : (
          opportunities.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))
        ))
      )}
    </div>
  );
}

export default Opportunities;
