import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getAdminOpportunities,
  deleteOpportunity,
  publishOpportunity,
  unpublishOpportunity,
} from "../api/adminOpportunities";
import AdminTabs from "../components/AdminTabs";
import { daysLeft, formatDate } from "../deadline";
import { OPPORTUNITY_TYPES } from "../opportunityTypes";
import { usePageTitle } from "../usePageTitle";

// What visitors actually see: a published post past its deadline is hidden.
function statusChip(opportunity) {
  if (opportunity.status === "DRAFT") {
    return <span className="chip">Draft</span>;
  }

  if (daysLeft(opportunity.applicationDeadline) < 0) {
    return <span className="chip chip-urgent">Expired</span>;
  }

  return <span className="chip chip-ok">Published</span>;
}

function AdminOpportunities() {
  const [opportunities, setOpportunities] = useState(null);

  const [status, setStatus] = useState("");

  const [error, setError] = useState("");

  const [version, setVersion] = useState(0);

  usePageTitle("Admin: opportunities");

  function loadOpportunities() {
    setVersion((v) => v + 1);
  }

  useEffect(() => {
    let ignore = false;

    getAdminOpportunities(status)
      .then((data) => {
        if (ignore) return;

        setError("");
        setOpportunities(data);
      })
      .catch((error) => {
        if (!ignore) setError(error.message);
      });

    return () => {
      ignore = true;
    };
  }, [status, version]);

  async function handleDelete(opportunity) {
    const confirmed = window.confirm(
      `Delete “${opportunity.title}”? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteOpportunity(opportunity.id);

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
    <>
      <div className="page-head">
        <h1>Admin</h1>
      </div>

      <AdminTabs />

      <div className="toolbar">
        <Link to="/admin/opportunities/create" className="btn">
          New opportunity
        </Link>

        <label htmlFor="status" className="field-label">
          Show
        </label>

        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All</option>

          <option value="DRAFT">Drafts</option>

          <option value="PUBLISHED">Published</option>
        </select>
      </div>

      {error && (
        <p className="notice notice-error" role="alert">
          {error}
        </p>
      )}

      {!opportunities ? (
        !error && <p className="muted">Loading...</p>
      ) : opportunities.length === 0 ? (
        <p className="empty">Nothing here yet.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Type</th>
                <th scope="col">Deadline</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>

            <tbody>
              {opportunities.map((opportunity) => (
                <tr key={opportunity.id}>
                  <td>
                    <strong>{opportunity.title}</strong>
                    <br />
                    <span className="muted">
                      {opportunity.organizationName}
                    </span>
                  </td>

                  <td>{OPPORTUNITY_TYPES[opportunity.type]}</td>

                  <td className="nowrap">
                    {formatDate(opportunity.applicationDeadline)}
                  </td>

                  <td>{statusChip(opportunity)}</td>

                  <td>
                    <div className="row-actions">
                      <Link
                        to={`/admin/opportunities/${opportunity.id}/edit`}
                        className="btn btn-secondary btn-small"
                      >
                        Edit
                      </Link>

                      {opportunity.status === "DRAFT" ? (
                        <button
                          type="button"
                          className="btn btn-small"
                          onClick={() => handlePublish(opportunity.id)}
                        >
                          Publish
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-secondary btn-small"
                          onClick={() => handleUnpublish(opportunity.id)}
                        >
                          Unpublish
                        </button>
                      )}

                      <button
                        type="button"
                        className="btn btn-danger btn-small"
                        onClick={() => handleDelete(opportunity)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default AdminOpportunities;
