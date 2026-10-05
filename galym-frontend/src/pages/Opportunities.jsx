import { useEffect, useState } from "react";
import { getOpportunities } from "../api/opportunities";
import { Link } from "react-router-dom";

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
        loadOpportunities();
    }, []);

    function handleSearch(e) {
        e.preventDefault();

        loadOpportunities({
            type,
            country,
            city,
            organizationName,
            hasScholarship
        });
    }

    if (loading) {
        return <p>Loading opportunities...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>

            <h1>Opportunities</h1>

            <form onSubmit={handleSearch}>

                <div>
                    <label>Type</label>

                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="INTERNSHIP">Internship</option>
                        <option value="MASTERS">Masters</option>
                        <option value="SCHOLARSHIP">Scholarship</option>
                        <option value="EXCHANGE_PROGRAM">
                            Exchange Program
                        </option>
                        <option value="RESEARCH">Research</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>

                <div>
                    <label>Country</label>

                    <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    />
                </div>

                <div>
                    <label>City</label>

                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                </div>

                <div>
                    <label>Organization</label>

                    <input
                        type="text"
                        value={organizationName}
                        onChange={(e) =>
                            setOrganizationName(e.target.value)
                        }
                    />
                </div>

                <div>
                    <label>Scholarship</label>

                    <select
                        value={hasScholarship}
                        onChange={(e) =>
                            setHasScholarship(e.target.value)
                        }
                    >
                        <option value="">All</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>

                <button type="submit">
                    Search
                </button>

            </form>

            <hr />

            {opportunities.length === 0 ? (
                <p>No opportunities available.</p>
            ) : (
                opportunities.map((opportunity) => (
                    <div key={opportunity.id}>

                        <h2>{opportunity.title}</h2>

                        <p>
                            Type: {opportunity.type}
                        </p>

                        <p>
                            Organization: {opportunity.organizationName}
                        </p>

                        <p>
                            Location: {opportunity.city},{" "}
                            {opportunity.country}
                        </p>

                        <p>
                            Deadline: {opportunity.applicationDeadline}
                        </p>

                        {opportunity.hasScholarship && (
                            <p>Scholarship available</p>
                        )}
                        <Link to={`/opportunities/${opportunity.id}`}>
                            View Details
                        </Link>

                        <hr />

                    </div>
                ))
            )}

        </div>
    );
}

export default Opportunities;