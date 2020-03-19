CREATE TABLE sparkle_entry (
    entryId INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    title TEXT NOT NULL, 
    date DATE DEFAULT now() NOT NULL,
    content TEXT NOT NULL,
    journalId INTEGER REFERENCES sparkle_journal(journalId) ON DELETE CASCADE NOT NULL,
    quoteId INTEGER REFERENCES sparkle_quotes(quoteId)
);