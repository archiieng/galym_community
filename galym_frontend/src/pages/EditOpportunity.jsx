import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import OpportunityForm
    from "../components/OpportunityForm";

import {
    getAdminOpportunityById,
    updateOpportunity
} from "../api/adminOpportunities";

function EditOpportunity() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [opportunity, setOpportunity] =
        useState(null);

    const [error, setError] =
        useState("");

    useEffect(() => {

        async function loadOpportunity() {

            try {

                const data =
                    await getAdminOpportunityById(
                        id
                    );

                setOpportunity(data);

            } catch (error) {

                setError(error.message);
            }
        }

        loadOpportunity();

    }, [id]);

    async function handleUpdate(formData) {

        try {

            await updateOpportunity(
                id,
                formData
            );

            navigate(
                "/admin/opportunities"
            );

        } catch (error) {

            setError(error.message);
        }
    }

    if (!opportunity) {

        return (
            <p>
                {error || "Loading..."}
            </p>
        );
    }

    return (
        <div>

            <h1>
                Edit Opportunity
            </h1>

            {error && (
                <p>{error}</p>
            )}

            <OpportunityForm
                initialData={opportunity}
                onSubmit={handleUpdate}
                buttonText="Save Changes"
            />

        </div>
    );
}

export default EditOpportunity;