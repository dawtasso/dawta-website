# Survey-Vote Matches Dataset

## survey_vote_matches_judged.csv

This dataset contains matched pairs between **EU citizen survey questions** (from Eurobarometer surveys) and **European Parliament votes**, along with relevance judgments.

### Columns

| Column | Description |
|--------|-------------|
| `question_id` | Unique identifier for the survey question |
| `question_text` | Full text of the survey question |
| `file_name` | Source Eurobarometer survey file |
| `vote_id` | European Parliament vote identifier |
| `vote_summary` | Summary of the EP vote content |
| `similarity_score` | Semantic similarity score (0-1) between question and vote |
| `llm_score` | LLM relevance judgment (1-10 scale) |
| `llm_explanation` | LLM explanation for the match relevance |
| `llm_go` | Boolean indicating if the match is considered valid (True/False) |

### Purpose

This dataset enables analysis of the correlation between EU public opinion (as captured by Eurobarometer surveys) and European Parliament legislative activity, helping to assess democratic representation and policy alignment with citizen concerns.
