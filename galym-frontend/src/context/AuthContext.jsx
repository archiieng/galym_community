import { createContext, useState, useEffect } from "react";
import { getCurrentUser } from "../api/auth";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [role, setRole] = useState(null);

    useEffect(() => {
        if (!token) {
            setRole(null);
            return;
        }
        getCurrentUser(token)
            .then((user) => setRole(user.role))
            .catch(() => setRole(null));
    }, [token]);

    function login(newToken) {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    }

    function logout() {
        localStorage.removeItem("token");
        setToken(null);
        setRole(null);
    }

    return (
        <AuthContext.Provider value={{ token, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}