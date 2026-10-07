-- Free-text fields were capped at 255 characters.
ALTER TABLE galym
    ALTER COLUMN description TYPE text,
    ALTER COLUMN eligibility TYPE text,
    ALTER COLUMN application_instructions TYPE text,
    ALTER COLUMN funding_info TYPE text,
    ALTER COLUMN application_link TYPE text;

ALTER TABLE users ADD CONSTRAINT users_email_key UNIQUE (email);
