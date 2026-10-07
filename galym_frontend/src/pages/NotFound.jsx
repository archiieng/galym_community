import { Link } from "react-router-dom";
import { usePageTitle } from "../usePageTitle";

function NotFound() {
  usePageTitle("Page not found");

  return (
    <div className="empty">
      <h1>This page does not exist</h1>

      <p style={{ marginBlock: 12 }}>
        The address may be mistyped, or the opportunity may have closed.
      </p>

      <p>
        <Link to="/opportunities" className="btn">
          See open opportunities
        </Link>
      </p>
    </div>
  );
}

export default NotFound;
