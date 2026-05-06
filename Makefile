.PHONY: install install-backend install-frontend start start-backend start-frontend start-offline sync

# Install all dependencies
install: install-backend install-frontend

# Install backend dependencies
install-backend:
	cd backend && uv sync

# Install frontend dependencies
install-frontend:
	cd frontend && npm install

# Sync relevance_scores between SQLite and Supabase (bidirectional LWW)
sync:
	cd backend && uv run python -m src.scripts.sync_relevance_scores

# Start both services (in parallel), sync first
start: sync
	@echo "Starting backend and frontend..."
	@(cd backend && uv run uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload) & \
	(cd frontend && npm run dev) & \
	wait

# Start both services in offline mode (SQLite only, no sync)
start-offline:
	@echo "Starting in offline mode (SQLite only, no sync)..."
	@export OFFLINE_MODE=true && \
	(cd backend && uv run uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload) & \
	(cd frontend && npm run dev) & \
	wait

# Start backend service
start-backend:
	cd backend && uv run uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload

# Start frontend service
start-frontend:
	cd frontend && npm run dev

