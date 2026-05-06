from datetime import datetime

from loguru import logger

from src.models import EpAffairDetail, EpAffairSummary, EpArticleWithRelevance
from src.services.europressing_db import get_db


class EuropressingService:
    """Service for browsing europressing affairs and labeling article relevance."""

    @classmethod
    def get_all_affairs(cls) -> list[EpAffairSummary]:
        """Get all affairs with article and label counts."""
        try:
            db = get_db()
            affairs = db.get_all_affairs()
            article_counts = db.get_article_counts()
            labeled_counts = db.get_labeled_counts()
            category_counts = db.get_category_counts()

            result = []
            for affair in affairs:
                aid = affair["affair_id"]
                cats = category_counts.get(aid, {})
                result.append(
                    EpAffairSummary(
                        affair_id=aid,
                        title=affair.get("title") or "",
                        category=affair.get("category"),
                        severity=affair.get("severity"),
                        status=affair.get("status"),
                        date_start=affair.get("date_start"),
                        date_facts=affair.get("date_facts"),
                        date_verdict=affair.get("date_verdict"),
                        politician_name=affair.get("politician_name"),
                        politician_party=affair.get("politician_party"),
                        article_count=article_counts.get(aid, 0),
                        labeled_count=labeled_counts.get(aid, 0),
                        high_count=cats.get("HIGH", 0),
                        medium_count=cats.get("MEDIUM", 0),
                        low_count=cats.get("LOW", 0),
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
            db = get_db()
            affair = db.get_affair(affair_id)
            if not affair:
                return None

            articles_data = db.get_articles_for_affair(affair_id)
            scores_by_article = db.get_scores_for_affair(affair_id)

            # Compute reference date for days_since_case
            case_dates = [
                cls._parse_date(affair.get(f))
                for f in ("date_facts", "date_start", "date_verdict")
            ]
            case_dates = [d for d in case_dates if d]
            ref_date = max(case_dates) if case_dates else None

            labeled_count = 0
            articles = []
            for art in articles_data:
                art_id = art["doc_key"]
                score = scores_by_article.get(art_id, {})

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
                        title=art.get("title") or "",
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

            articles.sort(
                key=lambda a: (a.days_since_case is None, abs(a.days_since_case or 0))
            )

            return EpAffairDetail(
                affair_id=affair_id,
                title=affair.get("title") or "",
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
                politician_name=affair.get("politician_name"),
                politician_party=affair.get("politician_party"),
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
        """Update manual_judgment and notes on relevance scores."""
        try:
            db = get_db()
            db.save_judgment(article_id, affair_id, manual_judgment, notes)
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
            try:
                return datetime.strptime(date_str[:10], "%Y-%m-%d")
            except (ValueError, AttributeError):
                return None
