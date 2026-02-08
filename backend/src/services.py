import csv
import json
import random
from pathlib import Path
from typing import Any, Dict, List

from loguru import logger

from .models import JudgmentStats, Project, SurveyVoteMatch
from .settings import settings

DATA_DIR = Path(settings.data_dir)
UE_PAIR_DIR = DATA_DIR / "ue-pair-correlation"
CSV_FILE = UE_PAIR_DIR / "survey_vote_matches_judged.csv"
JUDGMENTS_FILE = UE_PAIR_DIR / "judgments.json"


class ProjectService:
    """Project service."""

    @staticmethod
    def get_projects() -> List[Project]:
        """Get list of projects from JSON file."""
        projects_file: Path = DATA_DIR / "projects.json"

        # Log data directory info for debugging
        logger.info(f"Data directory: {DATA_DIR}")
        logger.info(f"Data directory exists: {DATA_DIR.exists()}")
        logger.info(f"Projects file path: {projects_file}")
        logger.info(f"Projects file exists: {projects_file.exists()}")

        if not projects_file.exists():
            logger.warning(f"Projects file not found at {projects_file}")
            if DATA_DIR.exists():
                logger.info(f"Contents of {DATA_DIR}: {list(DATA_DIR.iterdir())}")
            return []

        try:
            with open(projects_file, encoding="utf-8") as f:
                projects_data: List[Dict[str, Any]] = json.load(f)
                projects: List[Project] = []
                for p in projects_data:
                    project_dir = DATA_DIR / p["id"]
                    # Check if summary.md and structure.md exist
                    p["hasSummary"] = (project_dir / "summary.md").exists()
                    p["hasPartialReport"] = (project_dir / "partial_report.md").exists()
                    projects.append(Project.model_validate(p))
                logger.info(f"Successfully loaded {len(projects)} projects")
                return projects
        except Exception as e:
            logger.error(f"Error loading projects: {e}", exc_info=True)
            return []


class JudgmentService:
    """Service for survey-vote match judgments."""

    _matches_cache: List[SurveyVoteMatch] | None = None

    @classmethod
    def _load_matches(cls) -> List[SurveyVoteMatch]:
        """Load matches from CSV file (cached)."""
        if cls._matches_cache is not None:
            return cls._matches_cache

        if not CSV_FILE.exists():
            logger.warning(f"CSV file not found at {CSV_FILE}")
            return []

        try:
            matches: List[SurveyVoteMatch] = []
            with open(CSV_FILE, encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    match = SurveyVoteMatch(
                        question_id=row["question_id"],
                        vote_id=int(row["vote_id"]),
                        question_text=row["question_text"],
                        vote_summary=row["vote_summary"],
                        similarity_score=float(row["similarity_score"]),
                        llm_score=int(row["llm_score"]),
                        llm_go=row["llm_go"].lower() == "true",
                    )
                    matches.append(match)
            cls._matches_cache = matches
            logger.info(f"Loaded {len(matches)} matches from CSV")
            return matches
        except Exception as e:
            logger.error(f"Error loading matches: {e}", exc_info=True)
            return []

    @classmethod
    def _load_judgments(cls) -> Dict[str, Dict[str, int]]:
        """Load judgments from JSON file."""
        if not JUDGMENTS_FILE.exists():
            return {}

        try:
            with open(JUDGMENTS_FILE, encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error loading judgments: {e}", exc_info=True)
            return {}

    @classmethod
    def _save_judgments(cls, judgments: Dict[str, Dict[str, int]]) -> None:
        """Save judgments to JSON file."""
        try:
            JUDGMENTS_FILE.parent.mkdir(parents=True, exist_ok=True)
            with open(JUDGMENTS_FILE, "w", encoding="utf-8") as f:
                json.dump(judgments, f, indent=2, ensure_ascii=False)
        except Exception as e:
            logger.error(f"Error saving judgments: {e}", exc_info=True)

    @classmethod
    def _get_match_key(cls, question_id: str, vote_id: int) -> str:
        """Generate unique key for a match."""
        return f"{question_id}-{vote_id}"

    @classmethod
    def get_all_matches(cls) -> List[SurveyVoteMatch]:
        """Get all matches."""
        return cls._load_matches()

    @classmethod
    def get_random_match(cls) -> SurveyVoteMatch | None:
        """Get a random match."""
        matches = cls._load_matches()
        if not matches:
            return None
        return random.choice(matches)

    @classmethod
    def submit_judgment(cls, question_id: str, vote_id: int, thumbs_up: bool) -> JudgmentStats:
        """Submit a judgment for a match."""
        judgments = cls._load_judgments()
        key = cls._get_match_key(question_id, vote_id)

        if key not in judgments:
            judgments[key] = {"thumbs_up": 0, "thumbs_down": 0}

        if thumbs_up:
            judgments[key]["thumbs_up"] += 1
        else:
            judgments[key]["thumbs_down"] += 1

        cls._save_judgments(judgments)

        return JudgmentStats(
            thumbs_up=judgments[key]["thumbs_up"],
            thumbs_down=judgments[key]["thumbs_down"],
        )

    @classmethod
    def get_stats(cls) -> Dict[str, Any]:
        """Get aggregated judgment statistics."""
        judgments = cls._load_judgments()
        matches = cls._load_matches()

        total_thumbs_up = sum(j.get("thumbs_up", 0) for j in judgments.values())
        total_thumbs_down = sum(j.get("thumbs_down", 0) for j in judgments.values())
        total_judgments = total_thumbs_up + total_thumbs_down

        return {
            "totalMatches": len(matches),
            "matchesJudged": len(judgments),
            "totalJudgments": total_judgments,
            "thumbsUp": total_thumbs_up,
            "thumbsDown": total_thumbs_down,
            "agreementRate": total_thumbs_up / total_judgments if total_judgments > 0 else 0,
        }
