import { useEffect, useState } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";

import OpportunityForm from "../components/OpportunityForm";

import {
  getAdminOpportunityById,
  updateOpportunity,
} from "../api/adminOpportunities";
import { usePageTitle } from "../usePageTitle";

function EditOpportunity() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [opportunity, setOpportunity] = useState(null);

  const [error, setError] = useState("");

  usePageTitle("Edit opportunity");

  useEffect(() => {
    getAdminOpportunityById(id)
      .then(setOpportunity)
      .catch((error) => setError(error.message));
  }, [id]);

  async function handleUpdate(formData) {
    try {
      setError("");

      await updateOpportunity(id, formData);

      navigate("/admin/opportunities");
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    }
  }

  if (!opportunity) {
    return error ? (
      <div className="empty" role="alert">
        <p>This opportunity could not be loaded: {error}</p>
        <p>
          <Link to="/admin/opportunities">Back to the list</Link>
        </p>
      </div>
    ) : (
      <p className="muted">Loading...</p>
    );
  }

  return (
    <>
      <div className="page-head">
        <div>
          <p>
            <Link to="/admin/opportunities">Back to the list</Link>
          </p>
          <h1>Edit opportunity</h1>
        </div>
      </div>

      {/* key: a different id gets a fresh form, not the previous one's fields */}
      <OpportunityForm
        key={opportunity.id}
        initialData={opportunity}
        onSubmit={handleUpdate}
        buttonText="Save changes"
        error={error}
      />
    </>
  );
}

export default EditOpportunity;
