import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSavedOpportunities, unsaveOpportunity } from "../api/profile";
import OpportunityCard from "../components/OpportunityCard";
import { AuthContext } from "../context/AuthContext";

function Profile() {
  const { user } = useContext(AuthContext);

  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getSavedOpportunities()
      .then(setSaved)
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleRemove(id) {
    try {
      await unsaveOpportunity(id);

      setSaved(saved.filter((opportunity) => opportunity.id !== id));
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div>
      <h1>{user ? user.name : "Profile"}</h1>

      {user && <p>{user.email}</p>}

      <h2>Saved opportunities</h2>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : saved.length === 0 ? (
        <p>
          Nothing saved yet.{" "}
          <Link to="/opportunities">Browse opportunities</Link> and press Save
          on the ones you like.
        </p>
      ) : (
        saved.map((opportunity) => (
          <OpportunityCard key={opportunity.id} opportunity={opportunity}>
            <button
              className="secondary"
              onClick={() => handleRemove(opportunity.id)}
            >
              Remove
            </button>
          </OpportunityCard>
        ))
      )}
    </div>
  );
}

export default Profile;
