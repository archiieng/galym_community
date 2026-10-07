import { Link } from "react-router-dom";

function Home() {

    return (
        <div>

            <h1>Galym</h1>

            <p>
                Find scholarships, internships,
                research opportunities and exchange programs.
            </p>

            <Link to="/opportunities">
                Browse Opportunities
            </Link>

        </div>
    );
}

export default Home;