import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {

    const location = useLocation();
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    function handleLogout() {

        localStorage.removeItem("token");

        navigate("/login");
    }

    return (
        <nav>

            <Link to="/">
                Galym
            </Link>

            {" | "}

            <Link to="/opportunities">
                Opportunities
            </Link>

            {" | "}

            {!token ? (
                <>
                    <Link to="/login">
                        Login
                    </Link>

                    {" | "}

                    <Link to="/register">
                        Register
                    </Link>
                </>
            ) : (
                <>
                    <Link to="/admin/opportunities">
                        Admin
                    </Link>

                    {" | "}

                    <button onClick={handleLogout}>
                        Logout
                    </button>
                </>
            )}

        </nav>
    );
}

export default Navbar;