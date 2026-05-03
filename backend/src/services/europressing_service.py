from datetime import datetime

from loguru import logger

from src.models import EpArticleWithRelevance, EpCaseDetail, EpLegalCaseSummary
from src.supabase_client import get_supabase


class EuropressingService:
    """Service for browsing europressing legal cases and labeling article relevance."""

    @classmethod
    def get_all_cases(cls) -> list[EpLegalCaseSummary]:
        """Get all legal cases with article and label counts."""
        try:
            supabase = get_supabase()

            # 1. Fetch cases with politician info
            cases_resp = (
                supabase.table("ep_legal_cases")
                .select("*, ep_politicians(*)")
                .order("date_start", desc=True)
                .execute()
            )
            cases = cases_resp.data or []

            # 2. Count articles per affair_id
            ac_resp = (
                supabase.table("ep_article_cases")
                .select("affair_id")
                .execute()
            )
            article_counts: dict[str, int] = {}
            for row in ac_resp.data or []:
                aid = row["affair_id"]
                article_counts[aid] = article_counts.get(aid, 0) + 1

            # 3. Count labeled (manual_judgment IS NOT NULL) per affair_id
            rs_resp = (
                supabase.table("ep_relevance_scores")
                .select("affair_id")
                .not_.is_("manual_judgment", "null")
                .execute()
            )
            labeled_counts: dict[str, int] = {}
            for row in rs_resp.data or []:
                aid = row["affair_id"]
                labeled_counts[aid] = labeled_counts.get(aid, 0) + 1

            result = []
            for case in cases:
                politician = case.get("ep_politicians") or {}
                aid = case["affair_id"]
                result.append(
                    EpLegalCaseSummary(
                        affair_id=aid,
                        title=case.get("title", ""),
                        category=case.get("category"),
                        severity=case.get("severity"),
                        status=case.get("status"),
                        date_start=case.get("date_start"),
                        date_facts=case.get("date_facts"),
                        politician_name=politician.get("name"),
                        politician_party=politician.get("party"),
                        article_count=article_counts.get(aid, 0),
                        labeled_count=labeled_counts.get(aid, 0),
                    )
                )
            return result
        except Exception:
            logger.exception("Error fetching europressing cases")
            return []

    @classmethod
    def get_case_detail(cls, affair_id: str) -> EpCaseDetail | None:
        """Get case detail with articles and relevance scores."""
        try:
            supabase = get_supabase()

            # 1. Fetch case with politician
            case_resp = (
                supabase.table("ep_legal_cases")
                .select("*, ep_politicians(*)")
                .eq("affair_id", affair_id)
                .single()
                .execute()
            )
            case = case_resp.data
            if not case:
                return None

            politician = case.get("ep_politicians") or {}

            # 2. Get article_ids for this case
            ac_resp = (
                supabase.table("ep_article_cases")
                .select("article_id")
                .eq("affair_id", affair_id)
                .execute()
            )
            article_ids = [row["article_id"] for row in ac_resp.data or []]

            # 3. Fetch articles (ep_articles uses doc_key as identifier)
            articles_data: list[dict] = []
            if article_ids:
                articles_resp = (
                    supabase.table("ep_articles")
                    .select("*")
                    .in_("doc_key", article_ids)
                    .order("date_published", desc=True)
                    .execute()
                )
                articles_data = articles_resp.data or []

            # 4. Fetch relevance scores for this case
            rs_resp = (
                supabase.table("ep_relevance_scores")
                .select("*")
                .eq("affair_id", affair_id)
                .execute()
            )
            scores_by_article: dict[str, dict] = {}
            for row in rs_resp.data or []:
                scores_by_article[row["doc_key"]] = row

            # Compute reference date for days_since_case
            ref_date_str = case.get("date_start") or case.get("date_facts")
            ref_date = cls._parse_date(ref_date_str) if ref_date_str else None

            # Build article list (ep_articles uses doc_key, junction tables use article_id)
            labeled_count = 0
            articles = []
            for art in articles_data:
                art_id = art["doc_key"]
                score = scores_by_article.get(art_id, {})

                # Compute days_since_case
                days_since = None
                if ref_date:
                    art_date = cls._parse_date(art.get("date_published"))
                    if art_date:
                        days_since = (art_date - ref_date).days

                if score.get("manual_judgment") is not None:
                    labeled_count += 1

                articles.append(
                    EpArticleWithRelevance(
                        article_id=art_id,
                        title=art.get("title", ""),
                        source=art.get("source"),
                        date_published=art.get("date_published"),
                        content_text=art.get("content_text"),
                        days_since_case=days_since,
                        relevance_category=score.get("relevance_category"),
                        relevance_score=score.get("relevance_score"),
                        manual_judgment=score.get("manual_judgment"),
                        notes=score.get("notes"),
                    )
                )

            return EpCaseDetail(
                affair_id=affair_id,
                title=case.get("title", ""),
                category=case.get("category"),
                severity=case.get("severity"),
                status=case.get("status"),
                date_start=case.get("date_start"),
                date_facts=case.get("date_facts"),
                description=case.get("description"),
                politician_name=politician.get("name"),
                politician_party=politician.get("party"),
                articles=articles,
                article_count=len(articles),
                labeled_count=labeled_count,
            )
        except Exception:
            logger.exception("Error fetching case detail for %s", affair_id)
            return None

    @classmethod
    def set_manual_judgment(
        cls,
        article_id: str,
        affair_id: str,
        manual_judgment: bool | None,
        notes: str | None,
    ) -> bool:
        """Upsert manual_judgment and notes on ep_relevance_scores."""
        try:
            supabase = get_supabase()
            row = {
                "doc_key": article_id,
                "affair_id": affair_id,
                "manual_judgment": manual_judgment,
                "notes": notes,
                "reviewed_by": "admin",
                "reviewed_at": datetime.utcnow().isoformat(),
            }
            supabase.table("ep_relevance_scores").upsert(
                row, on_conflict="doc_key,affair_id"
            ).execute()
            return True
        except Exception:
            logger.exception("Error setting manual judgment")
            return False

    @staticmethod
    def _parse_date(date_str: str | None) -> datetime | None:
        if not date_str:
            return None
        try:
            return datetime.fromisoformat(date_str.replace("Z", "+00:00")).replace(
                tzinfo=None
            )
        except (ValueError, AttributeError):
            # Try date-only format
            try:
                return datetime.strptime(date_str[:10], "%Y-%m-%d")
            except (ValueError, AttributeError):
                return None
