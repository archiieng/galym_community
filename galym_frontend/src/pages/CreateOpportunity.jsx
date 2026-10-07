import { useState } from "react";
import { useNavigate } from "react-router-dom";

import OpportunityForm from "../components/OpportunityForm";

import { createOpportunity } from "../api/adminOpportunities";

function CreateOpportunity() {
  const navigate = useNavigate();

  const [error, setError] = useState("");

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
    <div>
      <h1>Create Opportunity</h1>

      {error && <p className="error">{error}</p>}

      <OpportunityForm
        onSubmit={handleCreate}
        buttonText="Create Opportunity"
      />
    </div>
  );
}

export default CreateOpportunity;
