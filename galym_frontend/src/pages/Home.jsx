import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOpportunities } from "../api/opportunities";
import OpportunityCard from "../components/OpportunityCard";

const LATEST_COUNT = 3;

function Home() {
  const [latest, setLatest] = useState([]);

  useEffect(() => {
    // ponytail: loads every published opportunity and keeps the newest few;
    // give the API a sort + limit once the list is long enough to notice.
    getOpportunities()
      .then((all) =>
        setLatest(
          all
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
            .slice(0, LATEST_COUNT),
        ),
      )
      // The home page still makes sense without the list.
      .catch(() => {});
  }, []);

  return (
    <div>
      <section className="hero">
        <h1>Galym</h1>

        <p>
          Find scholarships, internships, research opportunities and exchange
          programs.
        </p>

        <Link to="/opportunities">Browse all opportunities</Link>
      </section>

      {latest.length > 0 && (
        <section>
          <h2>Latest announcements</h2>

          {latest.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </section>
      )}
    </div>
  );
}

export default Home;
