FROM python:3.12-slim

WORKDIR /app

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Copy dependency files
COPY backend/pyproject.toml backend/uv.lock ./

# Install dependencies
RUN uv sync --frozen

# Copy application code
COPY backend/ .

# Copy data folder
COPY data ./data

# Set data directory for Docker
ENV DATA_DIR=/app/data

# Verify data files are copied
RUN test -f /app/data/projects.json || (echo "ERROR: projects.json not found!" && exit 1)

EXPOSE 8000

CMD ["sh", "-c", "uv run uvicorn src.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
