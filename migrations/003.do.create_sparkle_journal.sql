CREATE TABLE sparkle_journal (
    journalId INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    userId uuid REFERENCES sparkle_users,
    journalTitle TEXT, 
    entryCount INTEGER
);

CREATE OR REPLACE FUNCTION add_journal()
    RETURNS trigger AS
$Body$
BEGIN
    IF NEW userId THEN
        INSERT INTO sparkle_journal(userId)
        VALUES(NEW.userId);
    END IF;

    RETURN NEW;
END;
$Body$