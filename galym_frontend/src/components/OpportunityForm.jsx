import { useState } from "react";
import { useLocation } from "react-router-dom";
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

// Only the editable fields, so ids, status and timestamps never reach the API.
function editableFields(data) {
  return Object.fromEntries(
    Object.keys(EMPTY).map((name) => [name, data[name] ?? EMPTY[name]]),
  );
}

// A draft is what was in the form at the last submit that did not go through
// (session ended, connection dropped, server said no). It lives for the tab.
function readDraft(key) {
  try {
    const draft = JSON.parse(sessionStorage.getItem(key));

    return draft && editableFields(draft);
  } catch {
    return null;
  }
}

function writeDraft(key, form) {
  try {
    if (form) sessionStorage.setItem(key, JSON.stringify(form));
    else sessionStorage.removeItem(key);
  } catch {
    // Storage blocked: the form simply has no safety net.
  }
}

// Shared by the create and edit pages.
// `onSubmit` resolves to true when the opportunity was saved.
// `error` is the server's answer to the last submit; it is shown beside the
// button because the form is taller than the screen.
function OpportunityForm({ initialData = {}, onSubmit, buttonText, error }) {
  const draftKey = `draft:${useLocation().pathname}`;

  const [restored, setRestored] = useState(() => readDraft(draftKey) !== null);
  const [form, setForm] = useState(
    () => readDraft(draftKey) ?? editableFields(initialData),
  );
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, type, value, checked } = e.target;

    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSubmitting(true);
    // Kept until the save is confirmed: if the session ends mid-submit and the
    // admin is sent to log in, the text is still here when they come back.
    writeDraft(draftKey, form);
    try {
      if (await onSubmit(form)) writeDraft(draftKey, null);
    } finally {
      setSubmitting(false);
    }
  }

  function handleDiscard() {
    writeDraft(draftKey, null);
    setForm(editableFields(initialData));
    setRestored(false);
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
      {restored && (
        <p className="notice notice-ok" role="status">
          This is what you typed before the last save did not go through.{" "}
          <button type="button" className="link-btn" onClick={handleDiscard}>
            Discard it
          </button>
        </p>
      )}

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
