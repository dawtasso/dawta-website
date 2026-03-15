"""Service for computing demographic alignment with parliamentary votes."""

import csv
import io
from itertools import combinations
from urllib.request import urlopen

import numpy as np
from loguru import logger
from scipy.stats import chi2_contingency, norm

from src.supabase_client import get_supabase

ANSWERS_CSV_URL = "https://raw.githubusercontent.com/dawtasso/eu_survey_correlation/refs/heads/main/data/surveys/volume_b_answer_distributions.csv"

TARGET_DEMOGRAPHICS = ("gender", "income_difficulty", "class_belonging")

# Module-level cache
_cached_result: dict | None = None


def _load_csv_distributions() -> list[dict]:
    """Load and filter demographic distributions from remote CSV."""
    logger.info(f"Loading CSV from {ANSWERS_CSV_URL}")
    with urlopen(ANSWERS_CSV_URL) as resp:
        data = resp.read().decode("utf-8")

    rows = []
    reader = csv.DictReader(io.StringIO(data))
    for row in reader:
        is_summary = row.get("is_summary", "").strip().lower() == "true"
        demo_type = row.get("demographic_type", "").strip()

        if is_summary or demo_type not in TARGET_DEMOGRAPHICS:
            continue

        rows.append(
            {
                "sheet_id": row["sheet_id"].strip(),
                "file_name": row["file_name"].strip(),
                "question_clean": row.get("question_clean", "").strip(),
                "answer_label": row["answer_label"].strip(),
                "demographic_type": demo_type,
                "demographic_value": row["demographic_value"].strip(),
                "count": float(row.get("count", 0) or 0),
                "total_base": float(row.get("total_base", 0) or 0),
            }
        )
    logger.info(f"Loaded {len(rows)} demographic distribution rows")
    return rows


def _load_alignments() -> tuple[list[dict], list[dict]]:
    """Load alignments and accepted matches from Supabase."""
    supabase = get_supabase()

    alignments_resp = supabase.table("survey_answer_alignments").select("*").execute()
    matches_resp = (
        supabase.table("survey_vote_matches")
        .select(
            "match_id, question_id, question_clean, survey_file, vote_id, vote_summary_clean"
        )
        .eq("admin_validated", True)
        .execute()
    )

    return alignments_resp.data, matches_resp.data


def _compute_alignment(
    alignments: list[dict], matches: list[dict], distributions: list[dict]
) -> dict:
    """Join and compute alignment scores."""
    # Build alignment lookup: (question_id, survey_file, answer_label) -> alignment
    alignment_map: dict[tuple[str, str, str], dict] = {}
    for a in alignments:
        key = (
            str(a.get("question_id", "")).strip(),
            str(a.get("survey_file", "")).strip(),
            str(a.get("answer_label", "")).strip(),
        )
        alignment_map[key] = a

    # Build match lookup for context
    match_map: dict[str, dict] = {m["match_id"]: m for m in matches}

    # Join distributions with alignments
    joined = []
    for d in distributions:
        key = (d["sheet_id"], d["file_name"], d["answer_label"])
        a = alignment_map.get(key)
        if a is None:
            continue
        joined.append(
            {
                **d,
                "alignment": a.get("alignment", "unknown"),
                "match_id": a.get("match_id", ""),
            }
        )

    if not joined:
        logger.warning("Empty join between alignments and distributions")
        return _empty_result()

    # --- Per-question scores by demographic ---
    # Group by (question_id, match_id, demographic_type, demographic_value, alignment)
    # and sum counts
    buckets: dict[tuple, dict[str, float]] = {}
    for row in joined:
        group_key = (
            row["sheet_id"],
            row["match_id"],
            row["demographic_type"],
            row["demographic_value"],
        )
        if group_key not in buckets:
            buckets[group_key] = {
                "aligned": 0,
                "opposed": 0,
                "neutral": 0,
                "question_clean": row.get("question_clean", ""),
            }
        alignment = row["alignment"]
        count = row["count"]
        if alignment in ("aligned", "opposed"):
            buckets[group_key][alignment] += count
        else:
            buckets[group_key]["neutral"] += count

    # Compute per-group per-question scores
    per_question_rows = []
    for (q_id, match_id, demo_type, demo_value), counts in buckets.items():
        c_aligned = counts["aligned"]
        c_opposed = counts["opposed"]
        c_neutral = counts["neutral"]
        total = c_aligned + c_opposed + c_neutral
        denom = c_aligned + c_opposed

        alignment_rate = c_aligned / denom if denom > 0 else None
        net_score = (c_aligned - c_opposed) / total if total > 0 else None

        per_question_rows.append(
            {
                "question_id": q_id,
                "match_id": match_id,
                "demographic_type": demo_type,
                "demographic_value": demo_value,
                "count_aligned": c_aligned,
                "count_opposed": c_opposed,
                "count_neutral": c_neutral,
                "alignment_rate": alignment_rate,
                "net_alignment_score": net_score,
            }
        )

    # --- Aggregate across questions per demographic group ---
    agg_buckets: dict[tuple[str, str], dict] = {}
    for row in per_question_rows:
        key = (row["demographic_type"], row["demographic_value"])
        if key not in agg_buckets:
            agg_buckets[key] = {
                "rates": [],
                "net_scores": [],
                "count_aligned": 0,
                "count_opposed": 0,
                "count_neutral": 0,
                "questions": set(),
            }
        b = agg_buckets[key]
        if row["alignment_rate"] is not None:
            b["rates"].append(row["alignment_rate"])
        if row["net_alignment_score"] is not None:
            b["net_scores"].append(row["net_alignment_score"])
        b["count_aligned"] += row["count_aligned"]
        b["count_opposed"] += row["count_opposed"]
        b["count_neutral"] += row["count_neutral"]
        b["questions"].add(row["question_id"])

    by_demographic = []
    for (demo_type, demo_value), b in sorted(agg_buckets.items()):
        by_demographic.append(
            {
                "demographicType": demo_type,
                "demographicValue": demo_value,
                "alignmentRate": round(float(np.mean(b["rates"])), 4)
                if b["rates"]
                else None,
                "netAlignmentScore": round(float(np.mean(b["net_scores"])), 4)
                if b["net_scores"]
                else None,
                "countAligned": int(b["count_aligned"]),
                "countOpposed": int(b["count_opposed"]),
                "countNeutral": int(b["count_neutral"]),
                "questionCount": len(b["questions"]),
            }
        )

    # --- Per-question breakdown with demographics ---
    # Group by (question_id, match_id) -> list of demographic breakdowns
    q_groups: dict[tuple[str, str], list[dict]] = {}
    for row in per_question_rows:
        key = (row["question_id"], row["match_id"])
        if key not in q_groups:
            q_groups[key] = []
        q_groups[key].append(
            {
                "demographicType": row["demographic_type"],
                "demographicValue": row["demographic_value"],
                "alignmentRate": round(row["alignment_rate"], 4)
                if row["alignment_rate"] is not None
                else None,
                "netAlignmentScore": round(row["net_alignment_score"], 4)
                if row["net_alignment_score"] is not None
                else None,
                "countAligned": int(row["count_aligned"]),
                "countOpposed": int(row["count_opposed"]),
                "countNeutral": int(row["count_neutral"]),
            }
        )

    # --- Collect answer-level data per question ---
    # Key: (sheet_id, match_id, answer_label) -> {alignment, demographics: {(type, value): {count, total_base}}}
    AnswerKey = tuple[str, str, str]  # (sheet_id, match_id, answer_label)
    answer_data: dict[AnswerKey, dict] = {}
    for row in joined:
        akey: AnswerKey = (row["sheet_id"], row["match_id"], row["answer_label"])
        if akey not in answer_data:
            answer_data[akey] = {
                "alignment": row["alignment"],
                "demographics": {},
            }
        demo_key = (row["demographic_type"], row["demographic_value"])
        answer_data[akey]["demographics"][demo_key] = {
            "count": row["count"],
            "total_base": row["total_base"],
            "pct": round(row["count"] / row["total_base"] * 100, 1)
            if row["total_base"] > 0
            else 0,
        }

    by_question = []
    for (q_id, match_id), demographics in q_groups.items():
        m = match_map.get(match_id, {})
        # Gather answers for this question
        answers = []
        for (sid, mid, label), adata in answer_data.items():
            if sid == q_id and mid == match_id:
                demo_breakdown = [
                    {
                        "demographicType": dt,
                        "demographicValue": dv,
                        "count": int(info["count"]),
                        "totalBase": int(info["total_base"]),
                        "pct": info["pct"],
                    }
                    for (dt, dv), info in sorted(adata["demographics"].items())
                ]
                answers.append(
                    {
                        "answerLabel": label,
                        "alignment": adata["alignment"],
                        "demographics": demo_breakdown,
                    }
                )
        by_question.append(
            {
                "questionId": q_id,
                "questionClean": m.get("question_clean", ""),
                "surveyFile": m.get("survey_file", ""),
                "voteId": m.get("vote_id"),
                "voteSummaryClean": m.get("vote_summary_clean", ""),
                "answers": answers,
                "demographics": demographics,
            }
        )

    # --- Statistical tests ---
    statistics = {}
    for demo_type in TARGET_DEMOGRAPHICS:
        groups = [d for d in by_demographic if d["demographicType"] == demo_type]
        if len(groups) < 2:
            continue

        # Build contingency table
        aligned_counts = [g["countAligned"] for g in groups]
        opposed_counts = [g["countOpposed"] for g in groups]

        contingency = np.array([aligned_counts, opposed_counts])
        if contingency.sum() == 0:
            continue

        try:
            chi2, p_value, dof, _ = chi2_contingency(contingency)
            n = contingency.sum()
            min_dim = min(contingency.shape) - 1
            cramers_v = float(np.sqrt(chi2 / (n * min_dim))) if min_dim > 0 and n > 0 else 0.0

            # Pairwise z-tests
            pairwise = []
            for (g1, g2) in combinations(groups, 2):
                n1 = g1["countAligned"] + g1["countOpposed"]
                n2 = g2["countAligned"] + g2["countOpposed"]
                if n1 == 0 or n2 == 0:
                    continue
                p1 = g1["countAligned"] / n1
                p2 = g2["countAligned"] / n2
                p_pool = (g1["countAligned"] + g2["countAligned"]) / (n1 + n2)
                se = float(np.sqrt(p_pool * (1 - p_pool) * (1 / n1 + 1 / n2)))
                if se == 0:
                    continue
                z = (p1 - p2) / se
                z_p = float(2 * norm.sf(abs(z)))
                pairwise.append(
                    {
                        "group1": g1["demographicValue"],
                        "group2": g2["demographicValue"],
                        "rate1": round(p1, 4),
                        "rate2": round(p2, 4),
                        "zStat": round(z, 2),
                        "pValue": round(z_p, 4),
                        "significant": z_p < 0.05,
                    }
                )

            statistics[demo_type] = {
                "chiSquared": round(float(chi2), 2),
                "pValue": round(float(p_value), 4),
                "cramersV": round(cramers_v, 4),
                "significant": p_value < 0.05,
                "pairwise": pairwise,
            }
        except Exception:
            logger.exception(f"Error computing stats for {demo_type}")

    unique_questions = set()
    for row in per_question_rows:
        unique_questions.add(row["question_id"])

    return {
        "summary": {
            "totalQuestions": len(unique_questions),
            "totalAlignments": len(alignments),
        },
        "byDemographic": by_demographic,
        "byQuestion": by_question,
        "statistics": statistics,
    }


def _empty_result() -> dict:
    return {
        "summary": {"totalQuestions": 0, "totalAlignments": 0},
        "byDemographic": [],
        "byQuestion": [],
        "statistics": {},
    }


class CorrelationService:
    """Service for demographic alignment correlation analysis."""

    @classmethod
    def get_demographic_alignment(
        cls, demographic_type: str | None = None
    ) -> dict:
        """Compute and return demographic alignment data.

        Args:
            demographic_type: Optional filter (gender, income_difficulty, class_belonging).
        """
        global _cached_result

        try:
            if _cached_result is None:
                distributions = _load_csv_distributions()
                alignments, matches = _load_alignments()
                _cached_result = _compute_alignment(
                    alignments, matches, distributions
                )

            result = _cached_result

            # Filter by demographic type if specified
            if demographic_type and demographic_type in TARGET_DEMOGRAPHICS:
                result = {
                    **result,
                    "byDemographic": [
                        d
                        for d in result["byDemographic"]
                        if d["demographicType"] == demographic_type
                    ],
                    "byQuestion": [
                        {
                            **q,
                            "demographics": [
                                d
                                for d in q["demographics"]
                                if d["demographicType"] == demographic_type
                            ],
                        }
                        for q in result["byQuestion"]
                    ],
                    "statistics": {
                        k: v
                        for k, v in result["statistics"].items()
                        if k == demographic_type
                    },
                }

            return result
        except Exception:
            logger.exception("Error computing demographic alignment")
            return _empty_result()

    @classmethod
    def invalidate_cache(cls) -> None:
        """Clear cached results (e.g. after new alignments are saved)."""
        global _cached_result
        _cached_result = None
