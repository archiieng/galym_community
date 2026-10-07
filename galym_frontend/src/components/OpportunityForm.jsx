import { useState } from "react";
import { OPPORTUNITY_TYPES } from "../opportunityTypes";

const EMPTY = {
  title: "",
  description: "",
  type: "INTERNSHIP",
  country: "",
  city: "",
  organizationName: "",
  eligibility: "",
  applicationInstructions: "",
  applicationDeadline: "",
  fundingInfo: "",
  hasScholarship: false,
  applicationLink: "",
};

// Shared by the create and edit pages. Only the editable fields are sent
// back, so ids, status and timestamps from `initialData` never reach the API.
function OpportunityForm({ initialData = {}, onSubmit, buttonText }) {
  const [form, setForm] = useState(() =>
    Object.fromEntries(
      Object.keys(EMPTY).map((name) => [
        name,
        initialData[name] ?? EMPTY[name],
      ]),
    ),
  );
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, type, value, checked } = e.target;

    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSubmitting(true);
    await onSubmit(form);
    setSubmitting(false);
  }

  // Every field is the same label + control pair; only the control differs.
  function field(name, label, control = "input", props = {}) {
    const Control = control;

    return (
      <div>
        <label htmlFor={name}>{label}</label>

        <Control
          id={name}
          name={name}
          value={form[name]}
          onChange={handleChange}
          required
          {...props}
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {field("title", "Title")}
      {field("description", "Description", "textarea", { rows: 4 })}

      <div>
        <label htmlFor="type">Type</label>

        <select id="type" name="type" value={form.type} onChange={handleChange}>
          {Object.entries(OPPORTUNITY_TYPES).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {field("country", "Country")}
      {field("city", "City")}
      {field("organizationName", "University or organization")}
      {field("eligibility", "Eligibility", "textarea", { rows: 3 })}
      {field(
        "applicationInstructions",
        "Application instructions",
        "textarea",
        {
          rows: 3,
        },
      )}
      {field("applicationDeadline", "Application deadline", "input", {
        type: "date",
      })}
      {field("fundingInfo", "Funding info", "textarea", { rows: 2 })}

      <label>
        <input
          type="checkbox"
          name="hasScholarship"
          checked={form.hasScholarship}
          onChange={handleChange}
        />{" "}
        Scholarship available
      </label>

      {field("applicationLink", "Application link (optional)", "input", {
        type: "url",
        required: false,
      })}

      <button type="submit" disabled={submitting}>
        {buttonText}
      </button>
    </form>
  );
}

export default OpportunityForm;
