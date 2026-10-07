import { useEffect, useRef } from "react";
import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminOpportunities from "./pages/AdminOpportunities.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";
import CreateOpportunity from "./pages/CreateOpportunity.jsx";
import EditOpportunity from "./pages/EditOpportunity.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import NotFound from "./pages/NotFound.jsx";
import Opportunities from "./pages/Opportunities.jsx";
import OpportunityDetail from "./pages/OpportunityDetail";
import Profile from "./pages/Profile.jsx";
import Register from "./pages/Register.jsx";

function admin(page) {
  return <ProtectedRoute adminOnly>{page}</ProtectedRoute>;
}

function App() {
  const location = useLocation();

  const firstPage = useRef(true);

  // A new page starts at its top, and keyboard and screen-reader users start
  // at its content instead of being left on a link that no longer exists.
  useEffect(() => {
    window.scrollTo(0, 0);

    if (firstPage.current) {
      firstPage.current = false;
      return;
    }

    document.getElementById("main")?.focus({ preventScroll: true });
  }, [location.pathname]);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <Navbar />

      {/* key: each new path remounts <main>, which replays the page-in fade */}
      <main
        id="main"
        key={location.pathname}
        tabIndex={-1}
        className="container page"
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/opportunities/:id" element={<OpportunityDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={<Navigate to="/admin/opportunities" replace />}
          />
          <Route
            path="/admin/opportunities"
            element={admin(<AdminOpportunities />)}
          />
          <Route
            path="/admin/opportunities/create"
            element={admin(<CreateOpportunity />)}
          />
          <Route
            path="/admin/opportunities/:id/edit"
            element={admin(<EditOpportunity />)}
          />
          <Route path="/admin/users" element={admin(<AdminUsers />)} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <div className="container">
          Galym lists opportunities for students. Deadlines are set by the
          organisers, so check the official page before you apply.
        </div>
      </footer>
    </>
  );
}

export default App;
