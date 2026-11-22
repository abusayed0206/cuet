-- name_words is WITHOUT ROWID with the key (word, studentid), so studentid is
-- not indexed on its own: "DELETE FROM name_words WHERE studentid = ?" had to
-- scan the whole table. The import migrations do that once per replaced
-- student, which cost 148 million row reads - 29 times the free tier's daily
-- limit - and took the site down.
--
-- With this index the delete is a seek, and the importer also batches the
-- deletes into one statement per migration.
CREATE INDEX IF NOT EXISTS idx_name_words_studentid ON name_words(studentid);
