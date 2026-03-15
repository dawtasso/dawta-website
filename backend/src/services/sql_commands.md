## survey answer alignments

```sql
CREATE TABLE survey_answer_alignments (
    match_id TEXT NOT NULL,
    answer_label TEXT NOT NULL,
    alignment TEXT NOT NULL CHECK (alignment IN ('aligned', 'opposed', 'neutral', 'unknown')),
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (match_id, answer_label)
  );
```