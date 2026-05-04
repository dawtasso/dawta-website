from datetime import datetime

from loguru import logger

from src.models import EpAffairDetail, EpAffairSummary, EpArticleWithRelevance
from src.supabase_client import get_supabase


class EuropressingService:
    """Service for browsing europressing affairs and labeling article relevance."""

    @staticmethod
    def _fetch_all_rows(query_builder) -> list[dict]:
        """Paginate through a Supabase query to fetch all rows (bypasses 1000 row limit)."""
        page_size = 1000
        offset = 0
        all_rows: list[dict] = []
        while True:
            resp = query_builder.range(offset, offset + page_size - 1).execute()
            rows = resp.data or []
            all_rows.extend(rows)
            if len(rows) < page_size:
                break
            offset += page_size
        return all_rows

    @classmethod
    def get_all_affairs(cls) -> list[EpAffairSummary]:
        """Get all affairs with article and label counts."""
        try:
            supabase = get_supabase()

            # 1. Fetch affairs with politician info
            affairs_resp = (
                supabase.table("ep_affairs")
                .select("*, ep_politicians(*)")
                .order("date_start", desc=True)
                .execute()
            )
            affairs = affairs_resp.data or []

            # 2. Count articles per affair_id
            ac_rows = cls._fetch_all_rows(
                supabase.table("ep_article_affairs").select("affair_id")
            )
            article_counts: dict[str, int] = {}
            for row in ac_rows:
                aid = row["affair_id"]
                article_counts[aid] = article_counts.get(aid, 0) + 1

            # 3. Count labeled (manual_judgment IS NOT NULL) per affair_id
            rs_rows = cls._fetch_all_rows(
                supabase.table("ep_relevance_scores")
                .select("affair_id")
                .not_.is_("manual_judgment", "null")
            )
            labeled_counts: dict[str, int] = {}
            for row in rs_rows:
                aid = row["affair_id"]
                labeled_counts[aid] = labeled_counts.get(aid, 0) + 1

            result = []
            for affair in affairs:
                politician = affair.get("ep_politicians") or {}
                aid = affair["affair_id"]
                result.append(
                    EpAffairSummary(
                        affair_id=aid,
                        title=affair.get("title", ""),
                        category=affair.get("category"),
                        severity=affair.get("severity"),
                        status=affair.get("status"),
                        date_start=affair.get("date_start"),
                        date_facts=affair.get("date_facts"),
                        date_verdict=affair.get("date_verdict"),
                        politician_name=politician.get("name"),
                        politician_party=politician.get("party_name"),
                        article_count=article_counts.get(aid, 0),
                        labeled_count=labeled_counts.get(aid, 0),
                    )
                )
            return result
        except Exception:
            logger.exception("Error fetching europressing affairs")
            return []

    @classmethod
    def get_affair_detail(cls, affair_id: str) -> EpAffairDetail | None:
        """Get affair detail with articles and relevance scores."""
        try:
            supabase = get_supabase()

            # 1. Fetch affair with politician
            affair_resp = (
                supabase.table("ep_affairs")
                .select("*, ep_politicians(*)")
                .eq("affair_id", affair_id)
                .single()
                .execute()
            )
            affair = affair_resp.data
            if not affair:
                return None

            politician = affair.get("ep_politicians") or {}

            # 2. Get doc_keys for this affair
            ac_resp = (
                supabase.table("ep_article_affairs")
                .select("doc_key")
                .eq("affair_id", affair_id)
                .execute()
            )
            doc_keys = [row["doc_key"] for row in ac_resp.data or []]

            # 3. Fetch articles
            articles_data: list[dict] = []
            if doc_keys:
                articles_resp = (
                    supabase.table("ep_articles")
                    .select("*")
                    .in_("doc_key", doc_keys)
                    .execute()
                )
                articles_data = articles_resp.data or []

            # 4. Fetch relevance scores for this affair
            rs_resp = (
                supabase.table("ep_relevance_scores")
                .select("*")
                .eq("affair_id", affair_id)
                .execute()
            )
            scores_by_article: dict[str, dict] = {}
            for row in rs_resp.data or []:
                scores_by_article[row["doc_key"]] = row

            # Compute reference date for days_since_case (latest of all case dates)
            case_dates = [cls._parse_date(affair.get(f)) for f in ("date_facts", "date_start", "date_verdict")]
            case_dates = [d for d in case_dates if d]
            ref_date = max(case_dates) if case_dates else None

            # Build article list
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

            # Sort by closest timedelta first, None values last
            articles.sort(key=lambda a: (a.days_since_case is None, abs(a.days_since_case or 0)))

            return EpAffairDetail(
                affair_id=affair_id,
                title=affair.get("title", ""),
                category=affair.get("category"),
                severity=affair.get("severity"),
                status=affair.get("status"),
                date_start=affair.get("date_start"),
                date_facts=affair.get("date_facts"),
                date_verdict=affair.get("date_verdict"),
                description=affair.get("description"),
                poligraph_url=affair.get("poligraph_url"),
                fine_eur=affair.get("fine_eur"),
                prison_months=affair.get("prison_months"),
                prison_suspended=affair.get("prison_suspended"),
                ineligibility_months=affair.get("ineligibility_months"),
                politician_name=politician.get("name"),
                politician_party=politician.get("party_name"),
                articles=articles,
                article_count=len(articles),
                labeled_count=labeled_count,
            )
        except Exception:
            logger.exception("Error fetching affair detail for %s", affair_id)
            return None

    @classmethod
    def set_manual_judgment(
        cls,
        article_id: str,
        affair_id: str,
        manual_judgment: bool | None,
        notes: str | None,
    ) -> bool:
        """Update manual_judgment and notes on ep_relevance_scores."""
        try:
            supabase = get_supabase()
            supabase.table("ep_relevance_scores").update({
                "manual_judgment": manual_judgment,
                "notes": notes,
                "reviewed_by": "admin",
                "reviewed_at": datetime.utcnow().isoformat(),
            }).eq("doc_key", article_id).eq("affair_id", affair_id).execute()
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
