import { useState } from "react";

function OpportunityForm({ initialData, onSubmit, buttonText }) {

    const [title, setTitle] = useState(initialData?.title || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [type, setType] = useState(initialData?.type || "INTERNSHIP");
    const [country, setCountry] = useState(initialData?.country || "");
    const [city, setCity] = useState(initialData?.city || "");
    const [organizationName, setOrganizationName] = useState(initialData?.organizationName || "");
    const [eligibility, setEligibility] = useState(initialData?.eligibility || "");
    const [applicationInstructions, setApplicationInstructions] = useState(initialData?.applicationInstructions || "");
    const [applicationDeadline, setApplicationDeadline] = useState(initialData?.applicationDeadline || "");
    const [fundingInfo, setFundingInfo] = useState(initialData?.fundingInfo || "");
    const [hasScholarship, setHasScholarship] = useState(initialData?.hasScholarship || false);
    const [applicationLink, setApplicationLink] = useState(initialData?.applicationLink || "");

    function handleSubmit(e) {
        e.preventDefault();
        onSubmit({
            title,
            description,
            type,
            country,
            city,
            organizationName,
            eligibility,
            applicationInstructions,
            applicationDeadline,
            fundingInfo,
            hasScholarship,
            applicationLink
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <div>
                <label>Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="INTERNSHIP">Internship</option>
                    <option value="MASTERS">Masters</option>
                    <option value="SCHOLARSHIP">Scholarship</option>
                    <option value="EXCHANGE_PROGRAM">Exchange Program</option>
                    <option value="RESEARCH">Research</option>
                    <option value="OTHER">Other</option>
                </select>
            </div>

            <div>
                <label>Country</label>
                <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                />
            </div>

            <div>
                <label>City</label>
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
            </div>

            <div>
                <label>University or organization</label>
                <input
                    type="text"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                />
            </div>

            <div>
                <label>Eligibility</label>
                <textarea
                    value={eligibility}
                    onChange={(e) => setEligibility(e.target.value)}
                />
            </div>

            <div>
                <label>Application instructions</label>
                <textarea
                    value={applicationInstructions}
                    onChange={(e) => setApplicationInstructions(e.target.value)}
                />
            </div>

            <div>
                <label>Application deadline</label>
                {/* type="date" both displays and produces a plain YYYY-MM-DD
                    string — exactly the format Spring's LocalDate expects,
                    so no extra conversion is needed before sending this. */}
                <input
                    type="date"
                    value={applicationDeadline}
                    onChange={(e) => setApplicationDeadline(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Funding info</label>
                <textarea
                    value={fundingInfo}
                    onChange={(e) => setFundingInfo(e.target.value)}
                />
            </div>

            <div>
                {/* A checkbox reads/writes .checked, not .value like every
                    other input above — that's the one real difference here. */}
                <label>
                    <input
                        type="checkbox"
                        checked={hasScholarship}
                        onChange={(e) => setHasScholarship(e.target.checked)}
                    />
                    {" "}Scholarship available
                </label>
            </div>

            <div>
                <label>Official application link</label>
                <input
                    type="url"
                    value={applicationLink}
                    onChange={(e) => setApplicationLink(e.target.value)}
                />
            </div>

            <button type="submit">{buttonText}</button>
        </form>
    );
}

export default OpportunityForm;