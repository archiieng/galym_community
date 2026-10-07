import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { BookmarkIcon } from "./icons";

// Saves an opportunity to the signed-in user's profile, or removes it.
// Visitors are sent to log in and brought back to the page they were on.
function SaveButton({
  opportunityId,
  className = "btn btn-secondary btn-small",
}) {
  const { token, savedIds, toggleSaved } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const saved = savedIds.has(opportunityId);

  function handleClick() {
    if (!token) {
      navigate("/login", {
        state: { from: location.pathname + location.search },
      });
      return;
    }

    toggleSaved(opportunityId);
  }

  return (
    <button
      type="button"
      className={`${className} save-btn`}
      aria-pressed={saved}
      onClick={handleClick}
    >
      <BookmarkIcon />
      {saved ? "Saved" : "Save"}
    </button>
  );
}

export default SaveButton;
