CREATE TABLE sparkle_journal (
    journalId INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    entryID INTEGER REFERENCES sparkle_entry
);