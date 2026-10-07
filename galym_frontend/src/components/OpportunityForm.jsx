import { useState } from "react";
import { todayIso } from "../deadline";
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
// `error` is the server's answer to the last submit; it is shown beside the
// button because the form is taller than the screen.
function OpportunityForm({ initialData = {}, onSubmit, buttonText, error }) {
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
    try {
      await onSubmit(form);
    } finally {
      setSubmitting(false);
    }
  }

  // Every field is the same label + control pair; only the control differs.
  function field(name, label, control = "input", props = {}) {
    const Control = control;

    return (
      <div className="field">
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
    <form className="form" onSubmit={handleSubmit}>
      {field("title", "Title")}
      {field("description", "Description", "textarea", { rows: 5 })}

      <div className="field">
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
      {field("eligibility", "Who can apply", "textarea", { rows: 3 })}
      {field("applicationInstructions", "How to apply", "textarea", {
        rows: 3,
      })}

      <div className="field">
        <label htmlFor="applicationDeadline">Application deadline</label>

        <input
          id="applicationDeadline"
          name="applicationDeadline"
          type="date"
          min={todayIso()}
          aria-describedby="deadline-hint"
          value={form.applicationDeadline}
          onChange={handleChange}
          required
        />

        <small id="deadline-hint">
          Today or later. The listing stays public through this day.
        </small>
      </div>

      {field("fundingInfo", "Funding", "textarea", { rows: 2 })}

      <label className="check">
        <input
          type="checkbox"
          name="hasScholarship"
          checked={form.hasScholarship}
          onChange={handleChange}
        />
        Funded (shown with a “Funded” tag in the list)
      </label>

      {field(
        "applicationLink",
        "Official application link (optional)",
        "input",
        {
          type: "url",
          required: false,
          placeholder: "https://",
        },
      )}

      {error && (
        <p className="notice notice-error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="btn" disabled={submitting}>
        {buttonText}
      </button>
    </form>
  );
}

export default OpportunityForm;
