import { NavLink } from "react-router-dom";

function AdminTabs() {
  return (
    <nav className="tabs" aria-label="Admin sections">
      <NavLink to="/admin/opportunities">Opportunities</NavLink>
      <NavLink to="/admin/users">Users</NavLink>
    </nav>
  );
}

export default AdminTabs;
