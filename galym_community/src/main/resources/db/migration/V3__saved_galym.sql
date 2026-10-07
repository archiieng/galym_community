-- Opportunities a user bookmarked. Rows disappear with either side.
CREATE TABLE saved_galym (
    user_id bigint NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    galym_id bigint NOT NULL REFERENCES galym (id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, galym_id)
);
