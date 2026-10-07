import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getAdminOpportunities,
  deleteOpportunity,
  publishOpportunity,
  unpublishOpportunity,
} from "../api/adminOpportunities";

function AdminOpportunities() {
  const [opportunities, setOpportunities] = useState([]);

  const [status, setStatus] = useState("");

  const [error, setError] = useState("");

  const [version, setVersion] = useState(0);

  function loadOpportunities() {
    setVersion((v) => v + 1);
  }

  useEffect(() => {
    getAdminOpportunities(status)
      .then((data) => {
        setError("");
        setOpportunities(data);
      })
      .catch((error) => setError(error.message));
  }, [status, version]);

  async function handleDelete(id) {
    const confirmed = window.confirm("Delete this opportunity?");

    if (!confirmed) {
      return;
    }

    try {
      await deleteOpportunity(id);

      loadOpportunities();
    } catch (error) {
      setError(error.message);
    }
  }

  async function handlePublish(id) {
    try {
      await publishOpportunity(id);

      loadOpportunities();
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleUnpublish(id) {
    try {
      await unpublishOpportunity(id);
      loadOpportunities();
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div>
      <h1>Admin Opportunities</h1>

      <div className="actions">
        <Link to="/admin/opportunities/create">Create Opportunity</Link>

        <label htmlFor="status">Filter status:</label>

        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All</option>

          <option value="DRAFT">Draft</option>

          <option value="PUBLISHED">Published</option>
        </select>
      </div>

      {error && <p className="error">{error}</p>}

      {opportunities.map((opportunity) => (
        <div className="card" key={opportunity.id}>
          <h2>{opportunity.title}</h2>

          <span className={`status status-${opportunity.status.toLowerCase()}`}>
            {opportunity.status}
          </span>

          <div className="actions">
            <Link to={`/admin/opportunities/${opportunity.id}/edit`}>Edit</Link>

            {opportunity.status === "DRAFT" && (
              <button onClick={() => handlePublish(opportunity.id)}>
                Publish
              </button>
            )}

            {opportunity.status === "PUBLISHED" && (
              <button
                className="secondary"
                onClick={() => handleUnpublish(opportunity.id)}
              >
                Unpublish
              </button>
            )}

            <button
              className="danger"
              onClick={() => handleDelete(opportunity.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminOpportunities;
