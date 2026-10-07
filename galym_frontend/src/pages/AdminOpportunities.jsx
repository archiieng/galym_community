import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    getAdminOpportunities,
    deleteOpportunity,
    publishOpportunity,
    unpublishOpportunity
} from "../api/adminOpportunities";

function AdminOpportunities() {

    const [opportunities, setOpportunities] =
        useState([]);

    const [status, setStatus] =
        useState("");

    const [error, setError] =
        useState("");

    async function loadOpportunities() {

        try {

            setError("");

            const data =
                await getAdminOpportunities(
                    status
                );

            setOpportunities(data);

        } catch (error) {

            setError(error.message);
        }
    }

    useEffect(() => {

        loadOpportunities();

    }, [status]);

    async function handleDelete(id) {

        const confirmed =
            window.confirm(
                "Delete this opportunity?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await deleteOpportunity(id);

            loadOpportunities();

        } catch (error) {

            setError(error.message);
        }
    }

    async function handlePublish(id) {

        try {

            await publishOpportunity(id);

            loadOpportunities();

        } catch (error) {

            setError(error.message);
        }
    }

    async function handleUnpublish(id) {
        try {
            await unpublishOpportunity(id);
            loadOpportunities();
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <div>

            <h1>
                Admin Opportunities
            </h1>

            <Link to="/admin/opportunities/create">
                Create Opportunity
            </Link>

            <br />
            <br />

            <label>
                Filter status:
            </label>

            <select
                value={status}
                onChange={(e) =>
                    setStatus(e.target.value)
                }
            >

                <option value="">
                    All
                </option>

                <option value="DRAFT">
                    Draft
                </option>

                <option value="PUBLISHED">
                    Published
                </option>

            </select>

            {error && (
                <p>{error}</p>
            )}

            {opportunities.map(
                (opportunity) => (

                    <div key={opportunity.id}>

                        <h2>
                            {opportunity.title}
                        </h2>

                        <p>
                            Status:{" "}
                            {opportunity.status}
                        </p>

                        <Link
                            to={`/admin/opportunities/${opportunity.id}/edit`}
                        >
                            Edit
                        </Link>

                        {" "}

                        {opportunity.status === "DRAFT" && (
                            <button onClick={() => handlePublish(opportunity.id)}>
                                Publish
                            </button>
                        )}

                        {opportunity.status === "PUBLISHED" && (
                            <button onClick={() => handleUnpublish(opportunity.id)}>
                                Unpublish
                            </button>
                        )}

                        {" "}

                        <button
                            onClick={() =>
                                handleDelete(
                                    opportunity.id
                                )
                            }
                        >
                            Delete
                        </button>

                        <hr />

                    </div>
                )
            )}

        </div>
    );
}

export default AdminOpportunities;