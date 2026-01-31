import uvicorn
from src.main import app
from src.settings import settings

if __name__ == "__main__":
    uvicorn.run(
        app,
        host=settings.host,
        port=settings.port,
        reload=True,
    )
