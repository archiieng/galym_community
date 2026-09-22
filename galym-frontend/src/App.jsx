import {Routes, Route} from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Opportunities from "./pages/Opportunities.jsx";
import Register from "./pages/Register.jsx";
import OpportunityDetail from "./pages/OpportunityDetail";


function App(){
  return (
      <>
          <Navbar/>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/opportunities" element={<Opportunities />} />
              <Route
                  path="/opportunities/:id"
                  element={<OpportunityDetail />}
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

          </Routes>
      </>
  );
}

export default App;