import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminOpportunities from "./pages/AdminOpportunities.jsx";
import CreateOpportunity from "./pages/CreateOpportunity.jsx";
import EditOpportunity from "./pages/EditOpportunity.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import NotFound from "./pages/NotFound.jsx";
import Opportunities from "./pages/Opportunities.jsx";
import OpportunityDetail from "./pages/OpportunityDetail";
import Profile from "./pages/Profile.jsx";
import Register from "./pages/Register.jsx";

function App() {
  return (
    <>
      <Navbar />
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
          path="/admin/opportunities"
          element={
            <ProtectedRoute adminOnly>
              <AdminOpportunities />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/opportunities/create"
          element={
            <ProtectedRoute adminOnly>
              <CreateOpportunity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/opportunities/:id/edit"
          element={
            <ProtectedRoute adminOnly>
              <EditOpportunity />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
