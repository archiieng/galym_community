import { useEffect, useRef, useState } from "react";
import { SESSION_EXPIRED } from "../api/client";
import {
  getMe,
  getSavedOpportunities,
  saveOpportunity,
  unsaveOpportunity,
} from "../api/profile";
import { AuthContext } from "./AuthContext";

const NO_IDS = new Set();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  // The signed-in user ({ id, name, email, role }); null until it is loaded.
  const [user, setUser] = useState(null);
  // Ids of the opportunities the user saved, so any list can mark them.
  const [savedIds, setSavedIds] = useState(NO_IDS);
  // Set when the account could not be loaded for a reason other than an
  // ended session (that one signs the user out, see below).
  const [loadError, setLoadError] = useState("");
  const [attempt, setAttempt] = useState(0);
  // Opportunities with a save or un-save request still on its way.
  const pendingToggles = useRef(new Set());

  useEffect(() => {
    if (!token) return;

    let ignore = false;

    Promise.all([getMe(), getSavedOpportunities()])
      .then(([me, saved]) => {
        if (ignore) return;

        setUser(me);
        setSavedIds(new Set(saved.map((opportunity) => opportunity.id)));
        setLoadError("");
      })
      .catch((error) => {
        if (!ignore) setLoadError(error.message);
      });

    return () => {
      ignore = true;
    };
  }, [token, attempt]);

  // Everything known about the account belongs to one token; a new token
  // (or none) starts from nothing, so one account never shows as another.
  function applyToken(newToken) {
    setToken(newToken);
    setUser(null);
    setSavedIds(NO_IDS);
    setLoadError("");
  }

  function login(newToken) {
    localStorage.setItem("token", newToken);
    applyToken(newToken);
  }

  function logout() {
    localStorage.removeItem("token");
    applyToken(null);
  }

  useEffect(() => {
    // The server refused the token (expired, or the account is gone). Public
    // pages simply carry on signed out; ProtectedRoute sends the rest to log in.
    function handleExpired() {
      localStorage.removeItem("token");
      applyToken(null);
    }

    // Logging in or out in another tab changes localStorage there; follow it.
    function handleStorage(event) {
      if (event.key === "token") applyToken(event.newValue);
    }

    window.addEventListener(SESSION_EXPIRED, handleExpired);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(SESSION_EXPIRED, handleExpired);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  // Flips the bookmark right away and puts it back if the server refuses.
  async function toggleSaved(id) {
    // A second click before the first request answers is ignored, so two
    // requests for one opportunity can never cross.
    if (pendingToggles.current.has(id)) return;
    pendingToggles.current.add(id);

    const wasSaved = savedIds.has(id);
    const flip = (on) =>
      setSavedIds((ids) => {
        const next = new Set(ids);
        if (on) next.add(id);
        else next.delete(id);
        return next;
      });

    flip(!wasSaved);

    try {
      await (wasSaved ? unsaveOpportunity(id) : saveOpportunity(id));
    } catch {
      // If the session ended, everything was just cleared; do not re-add it.
      if (localStorage.getItem("token")) flip(wasSaved);
    } finally {
      pendingToggles.current.delete(id);
    }
  }

  const value = {
    token,
    user,
    setUser,
    isAdmin: user?.role === "ADMIN",
    savedIds,
    setSavedIds,
    toggleSaved,
    loadError,
    retryLoad: () => setAttempt((n) => n + 1),
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
