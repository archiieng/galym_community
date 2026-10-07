-- The code reads these columns without null checks, so make the database refuse nulls.
-- Rows written by hand before this migration are filled in first.
UPDATE users SET role = 'USER' WHERE role IS NULL;
UPDATE galym SET status = 'DRAFT' WHERE status IS NULL;
UPDATE galym SET type = 'OTHER' WHERE type IS NULL;
UPDATE galym SET application_deadline = CURRENT_DATE WHERE application_deadline IS NULL;
UPDATE galym SET created_at = now() WHERE created_at IS NULL;
UPDATE galym SET updated_at = created_at WHERE updated_at IS NULL;

ALTER TABLE users ALTER COLUMN role SET NOT NULL;

ALTER TABLE galym
    ALTER COLUMN status SET NOT NULL,
    ALTER COLUMN type SET NOT NULL,
    ALTER COLUMN application_deadline SET NOT NULL,
    ALTER COLUMN created_at SET NOT NULL,
    ALTER COLUMN updated_at SET NOT NULL;

-- Emails are now stored and compared in lower case, so "Name@x.com" and "name@x.com"
-- are one account. If two existing accounts differ only in letter case, both are left
-- exactly as they are; those people keep logging in with the spelling they registered.
UPDATE users u
SET email = lower(u.email)
WHERE u.email <> lower(u.email)
  AND NOT EXISTS (
      SELECT 1 FROM users o WHERE o.id <> u.id AND lower(o.email) = lower(u.email)
  );
