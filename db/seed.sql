-- Sample data for local development. Run it with `npm run seed` from the repo root.
--
-- Safe to run more than once: accounts are matched by email and opportunities by title,
-- so existing rows are left alone. Deadlines are counted from the day a row is added, and
-- running the seed again moves any sample deadline that has passed forward, so the public
-- list does not empty out over time. The programme names are real, but the deadlines and
-- details here are illustrative. Do not run this against a production database: the
-- passwords are public.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Demo accounts (password hashes are BCrypt, the format the backend expects).
INSERT INTO users (name, email, password_hash, role)
VALUES
    ('Aigerim Admin', 'admin@galym.local', crypt('admin12345', gen_salt('bf', 10)), 'ADMIN'),
    ('Dias Student', 'user@galym.local', crypt('user12345', gen_salt('bf', 10)), 'USER')
ON CONFLICT (email) DO NOTHING;

-- The sample opportunities, kept in a temporary table because two statements read them.
CREATE TEMP TABLE seed_galym AS
SELECT *
FROM (
    VALUES
    (
        'Chevening Scholarship', 'SCHOLARSHIP', 'Chevening', 'United Kingdom', 'London',
        'A one-year master''s degree at a UK university of your choice, funded by the UK government. Scholars join a global alumni network and are expected to return home for at least two years afterwards.',
        'A completed undergraduate degree and at least two years of work experience. You must apply to three eligible UK master''s courses.',
        'Apply online through the Chevening application system. You will need two references and an unconditional offer from one of your three course choices before the scholarship is confirmed.',
        'Tuition fees, a monthly living allowance, and return flights.',
        TRUE, 'https://www.chevening.org/', 6, 'PUBLISHED', 40
    ),
    (
        'DAAD Study Scholarship for Master''s Degrees', 'SCHOLARSHIP', 'DAAD', 'Germany', 'Berlin',
        'Funding for graduates of all disciplines to complete a full master''s degree at a state or state-recognised university in Germany.',
        'A bachelor''s degree finished no more than six years ago, with above-average results.',
        'Choose up to three master''s programmes, then submit the application through the DAAD portal with a motivation letter, CV, transcripts and a reference from a university teacher.',
        'A monthly stipend, health insurance, and a travel allowance.',
        TRUE, 'https://www.daad.de/en/', 19, 'PUBLISHED', 26
    ),
    (
        'Software Engineering Summer Internship', 'INTERNSHIP', 'Steppe Labs', 'Kazakhstan', 'Almaty',
        'Twelve weeks in a product team building payment and logistics services. Interns ship real features with a mentor and present their work at the end of the summer.',
        'Third-year students and above in computer science or a related field. You should be comfortable with one backend language and with Git.',
        'Send a CV and a link to a project you are proud of. Shortlisted candidates complete a take-home task and one technical interview.',
        'Paid internship with lunch and a transport allowance.',
        FALSE, 'https://example.org/steppe-labs/internships', 12, 'PUBLISHED', 9
    ),
    (
        'Erasmus Mundus Joint Master''s', 'MASTERS', 'European Commission', 'Belgium', 'Brussels',
        'Two-year master''s programmes taught by a group of universities. You study in at least two European countries and graduate with a joint or multiple degree.',
        'A first higher-education degree. Each programme sets its own subject and language requirements.',
        'Pick a programme from the Erasmus Mundus catalogue and apply directly to its consortium. You can apply to up to three programmes in one year.',
        'Scholarships cover participation costs, travel, and a monthly living allowance for the whole programme.',
        TRUE, 'https://erasmus-plus.ec.europa.eu/', 34, 'PUBLISHED', 14
    ),
    (
        'Bolashak International Scholarship', 'SCHOLARSHIP', 'Center for International Programs', 'Kazakhstan', 'Astana',
        'The state scholarship of Kazakhstan for master''s, doctoral and research study at leading universities abroad, in fields the country needs most.',
        'Citizens of Kazakhstan with a bachelor''s degree, the required grade average, and an offer from a university on the approved list.',
        'Submit documents through the electronic government portal, then pass language and subject testing and an interview with the selection commission.',
        'Tuition, accommodation, a living allowance, medical insurance, and flights. Scholars return to work in Kazakhstan afterwards.',
        TRUE, 'https://bolashak.gov.kz/', 47, 'PUBLISHED', 5
    ),
    (
        'Exchange Semester in Barcelona', 'EXCHANGE_PROGRAM', 'Universitat de Barcelona', 'Spain', 'Barcelona',
        'Spend one semester taking courses that count towards your degree at home. Includes a language course before the term starts and support from the international office.',
        'Second-year students and above, nominated by a partner university.',
        'Ask your home university''s international office to nominate you, then complete the host university''s online application and learning agreement.',
        'No tuition at the host university; a monthly mobility grant for nominated students.',
        TRUE, 'https://web.ub.edu/en/', 58, 'PUBLISHED', 2
    ),
    (
        'Fulbright Foreign Student Program', 'SCHOLARSHIP', 'Fulbright', 'United States', 'Washington, D.C.',
        'Graduate study and research in the United States for students, young professionals and artists from abroad.',
        'A bachelor''s degree and strong English. Requirements and available fields are set by the Fulbright office in your country.',
        'Apply through the Fulbright commission or US embassy in your home country, not to US universities directly.',
        'Tuition, a living stipend, health insurance, and airfare.',
        TRUE, 'https://foreign.fulbrightonline.org/', 76, 'PUBLISHED', 18
    ),
    (
        'Summer Student Programme', 'RESEARCH', 'CERN', 'Switzerland', 'Geneva',
        'Eight to thirteen weeks working with a research team at the laboratory, with daily lectures from scientists and visits to the accelerators and experiments.',
        'Undergraduate or master''s students in physics, computing, engineering or mathematics with at least three years of university study.',
        'Apply online with a CV, transcripts and a reference letter. Places are offered once a year.',
        'A daily living allowance, a travel contribution, and health insurance.',
        TRUE, 'https://home.cern/', 91, 'PUBLISHED', 1
    ),
    (
        'Stipendium Hungaricum', 'SCHOLARSHIP', 'Tempus Public Foundation', 'Hungary', 'Budapest',
        'Bachelor''s, master''s and doctoral study at Hungarian universities, with many programmes taught in English.',
        'Nominated applicants from partner countries. Each programme lists its own entry requirements.',
        'Apply in the online system and to the sending partner in your country. You can list two programmes in order of preference.',
        'No tuition fee, a monthly stipend, a housing contribution, and medical insurance.',
        TRUE, 'https://stipendiumhungaricum.hu/', 104, 'PUBLISHED', 3
    ),
    (
        'Japanese Government (MEXT) Research Scholarship', 'RESEARCH', 'Ministry of Education of Japan', 'Japan', 'Tokyo',
        'Up to two years as a research student at a Japanese university, with the option to continue into a master''s or doctoral degree.',
        'University graduates under 35. Applicants take written exams and an interview at the Japanese embassy.',
        'Apply through the Japanese embassy in your country. Selected candidates then seek provisional acceptance from Japanese universities.',
        'Tuition, a monthly allowance, and a return flight. Six months of Japanese language training before the research period.',
        TRUE, 'https://www.studyinjapan.go.jp/en/', 128, 'PUBLISHED', 31
    ),
    (
        'Data Analyst Internship', 'INTERNSHIP', 'Astana Urban Lab', 'Kazakhstan', 'Astana',
        'A part-time internship during the semester: cleaning and analysing public transport data and building dashboards the city team uses every week.',
        'Students who know SQL and one of Python or R. Statistics coursework is a plus.',
        'Fill in the short form and attach a notebook or report you have written. Interviews are held online.',
        'Unpaid, with a flexible schedule and a reference letter on completion.',
        FALSE, 'https://example.org/astana-urban-lab', 23, 'PUBLISHED', 7
    ),
    (
        'Türkiye Scholarships', 'SCHOLARSHIP', 'Presidency for Turks Abroad', 'Türkiye', 'Ankara',
        'Government-funded bachelor''s, master''s and doctoral study at universities across Türkiye, including a preparatory year of Turkish.',
        'Minimum grade averages apply for each level, along with age limits.',
        'Apply online with transcripts, a statement of purpose and references. Shortlisted candidates are invited to an interview.',
        'Tuition, a monthly stipend, accommodation, health insurance, and a flight ticket.',
        TRUE, 'https://www.turkiyeburslari.gov.tr/', 150, 'DRAFT', 0
    )
) AS v (
    title, type, organization_name, country, city, description, eligibility,
    application_instructions, funding_info, has_scholarship, application_link,
    days_left, status, added_days_ago
);

INSERT INTO galym (
    title, type, organization_name, country, city, description, eligibility,
    application_instructions, funding_info, has_scholarship, application_link,
    application_deadline, status, created_by_user_id, created_at, updated_at
)
SELECT
    v.title, v.type, v.organization_name, v.country, v.city, v.description, v.eligibility,
    v.application_instructions, v.funding_info, v.has_scholarship, v.application_link,
    CURRENT_DATE + v.days_left, v.status,
    (SELECT id FROM users WHERE email = 'admin@galym.local'),
    now() - make_interval(days => v.added_days_ago), now() - make_interval(days => v.added_days_ago)
FROM seed_galym v
WHERE NOT EXISTS (SELECT 1 FROM galym g WHERE g.title = v.title);

-- Sample rows whose deadline has passed get a fresh one.
UPDATE galym g
SET application_deadline = CURRENT_DATE + v.days_left
FROM seed_galym v
WHERE g.title = v.title AND g.application_deadline < CURRENT_DATE;


-- Two saved opportunities, so the demo user's profile is not empty.
INSERT INTO saved_galym (user_id, galym_id)
SELECT u.id, g.id
FROM users u
JOIN galym g ON g.title IN ('Chevening Scholarship', 'Summer Student Programme')
WHERE u.email = 'user@galym.local'
ON CONFLICT DO NOTHING;

SELECT
    (SELECT count(*) FROM users) AS users,
    (SELECT count(*) FROM galym) AS opportunities,
    (SELECT count(*) FROM galym WHERE status = 'PUBLISHED') AS published;
