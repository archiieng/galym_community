import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import OpportunityForm from "../components/OpportunityForm";

import { createOpportunity } from "../api/adminOpportunities";
import { usePageTitle } from "../usePageTitle";

function CreateOpportunity() {
  const navigate = useNavigate();

  const [error, setError] = useState("");

  usePageTitle("New opportunity");

  async function handleCreate(formData) {
    try {
      setError("");

      await createOpportunity(formData);

      navigate("/admin/opportunities");
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <>
      <div className="page-head">
        <div>
          <p>
            <Link to="/admin/opportunities">Back to the list</Link>
          </p>
          <h1>New opportunity</h1>
          <p>
            It is saved as a draft. Publish it from the list when it is ready.
          </p>
        </div>
      </div>

      <OpportunityForm
        onSubmit={handleCreate}
        buttonText="Save draft"
        error={error}
      />
    </>
  );
}

export default CreateOpportunity;
