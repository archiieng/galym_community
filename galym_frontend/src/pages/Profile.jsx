import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  changePassword,
  getSavedOpportunities,
  updateProfile,
} from "../api/profile";
import OpportunityCard, {
  OpportunitySkeletons,
} from "../components/OpportunityCard";
import { AuthContext } from "../context/AuthContext";
import { usePageTitle } from "../usePageTitle";

function Profile() {
  // ProtectedRoute only renders this page once `user` is loaded.
  const { user, setUser, setSavedIds } = useContext(AuthContext);

  const [saved, setSaved] = useState(null);
  const [savedError, setSavedError] = useState("");

  usePageTitle("Profile");

  useEffect(() => {
    getSavedOpportunities()
      .then((list) => {
        setSaved(list);
        // The list may have changed in another tab or on another device.
        setSavedIds(new Set(list.map((opportunity) => opportunity.id)));
      })
      .catch((error) => setSavedError(error.message));
  }, [setSavedIds]);

  // A ticket un-saved here stays where it is, with its button back to "Save",
  // so a slip can be undone. It is gone the next time the page is opened.

  return (
    <>
      <div className="page-head">
        <div>
          <h1>{user.name}</h1>
          <p>
            {user.email}
            {user.role === "ADMIN" && (
              <>
                {" "}
                <span className="chip chip-open">Admin</span>
              </>
            )}
          </p>
        </div>
      </div>

      <section aria-labelledby="saved-title">
        <h2 id="saved-title" style={{ marginBottom: 16 }}>
          Saved opportunities
        </h2>

        {savedError ? (
          <p className="notice notice-error" role="alert">
            Your saved list could not be loaded: {savedError}
          </p>
        ) : !saved ? (
          <OpportunitySkeletons count={2} />
        ) : saved.length === 0 ? (
          <div className="empty">
            <p>You have not saved anything yet.</p>
            <p>
              <Link to="/opportunities">Browse opportunities</Link> and press
              Save on the ones you want to come back to.
            </p>
          </div>
        ) : (
          <div className="stack">
            {saved.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        )}
      </section>

      <section className="section" aria-labelledby="account-title">
        <h2 id="account-title">Account</h2>

        <div className="split">
          <NameForm user={user} onSaved={setUser} />
          <PasswordForm />
        </div>
      </section>
    </>
  );
}

function NameForm({ user, onSaved }) {
  const [name, setName] = useState(user.name);
  const [status, setStatus] = useState({});

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setStatus({ busy: true });
      onSaved(await updateProfile(name));
      setStatus({ ok: "Name saved." });
    } catch (error) {
      setStatus({ error: error.message });
    }
  }

  return (
    <form className="panel form" onSubmit={handleSubmit}>
      <h3>Your name</h3>

      <div className="field">
        <label htmlFor="profile-name">Name</label>
        <input
          id="profile-name"
          type="text"
          autoComplete="name"
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="profile-email">Email</label>
        <input
          id="profile-email"
          type="email"
          value={user.email}
          aria-describedby="email-hint"
          readOnly
        />
        <small id="email-hint">
          Your email is your login and cannot be changed here.
        </small>
      </div>

      <FormStatus status={status} />

      <button type="submit" className="btn" disabled={status.busy}>
        Save name
      </button>
    </form>
  );
}

function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState({});

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setStatus({ busy: true });
      await changePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setStatus({ ok: "Password changed." });
    } catch (error) {
      setStatus({ error: error.message });
    }
  }

  return (
    <form className="panel form" onSubmit={handleSubmit}>
      <h3>Change password</h3>

      <div className="field">
        <label htmlFor="current-password">Current password</label>
        <input
          id="current-password"
          type="password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="new-password">New password</label>
        <input
          id="new-password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          aria-describedby="new-password-hint"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <small id="new-password-hint">At least 8 characters.</small>
      </div>

      <FormStatus status={status} />

      <button type="submit" className="btn" disabled={status.busy}>
        Change password
      </button>
    </form>
  );
}

function FormStatus({ status }) {
  if (status.error) {
    return (
      <p className="notice notice-error" role="alert">
        {status.error}
      </p>
    );
  }

  if (status.ok) {
    return (
      <p className="notice notice-ok" role="status">
        {status.ok}
      </p>
    );
  }

  return null;
}

export default Profile;
