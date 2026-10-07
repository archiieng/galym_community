import { useContext, useEffect, useState } from "react";

import { changeUserRole, deleteUser, getUsers } from "../api/adminUsers";
import AdminTabs from "../components/AdminTabs";
import { AuthContext } from "../context/AuthContext";
import { usePageTitle } from "../usePageTitle";

function AdminUsers() {
  const { user: me } = useContext(AuthContext);

  const [users, setUsers] = useState(null);
  const [error, setError] = useState("");

  usePageTitle("Admin: users");

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch((error) => setError(error.message));
  }, []);

  async function handleRoleChange(user, role) {
    try {
      setError("");

      const updated = await changeUserRole(user.id, role);

      setUsers(users.map((u) => (u.id === updated.id ? updated : u)));
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleDelete(user) {
    const confirmed = window.confirm(
      `Delete the account of ${user.name} (${user.email})? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteUser(user.id);

      setUsers(users.filter((u) => u.id !== user.id));
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

      {error && (
        <p className="notice notice-error" role="alert">
          {error}
        </p>
      )}

      {!users ? (
        !error && <p className="muted">Loading...</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => {
                // Admins manage everyone but themselves, so nobody can lock
                // the last admin out by accident.
                const isMe = user.id === me.id;

                return (
                  <tr key={user.id}>
                    <td>
                      <strong>{user.name}</strong>
                      {isMe && <span className="muted"> (you)</span>}
                    </td>

                    <td>{user.email}</td>

                    <td>
                      <select
                        aria-label={`Role of ${user.name}`}
                        value={user.role}
                        disabled={isMe}
                        onChange={(e) => handleRoleChange(user, e.target.value)}
                      >
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="btn btn-danger btn-small"
                        disabled={isMe}
                        onClick={() => handleDelete(user)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default AdminUsers;
