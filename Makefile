.PHONY: install install-backend install-frontend start start-backend start-frontend

# Install all dependencies
install: install-backend install-frontend

# Install backend dependencies
install-backend:
	cd backend && uv sync

# Install frontend dependencies
install-frontend:
	cd frontend && npm install

# Start both services (in parallel)
start:
	@echo "Starting backend and frontend..."
	@(cd backend && uv run uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload) & \
	(cd frontend && npm run dev) & \
	wait

# Start backend service
start-backend:
	cd backend && uv run uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload

# Start frontend service
start-frontend:
	cd frontend && npm run dev

