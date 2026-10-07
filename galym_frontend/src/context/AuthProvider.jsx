import { useEffect, useState } from "react";
import { getMe } from "../api/profile";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  // The signed-in user ({ id, name, email, role }); null until it is loaded.
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!token) return;

    let ignore = false;

    getMe()
      .then((me) => {
        if (!ignore) setUser(me);
      })
      // An expired token is cleared by the API client, which also redirects.
      .catch(() => {});

    return () => {
      ignore = true;
    };
  }, [token]);

  function login(newToken) {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  const isAdmin = user?.role === "ADMIN";

  return (
    <AuthContext.Provider value={{ token, user, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
