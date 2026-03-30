from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from routes.cities import router as cities_router

# Create database tables
Base.metadata.create_all(bind=engine)

# Create the FastAPI application
app = FastAPI(
    title="WeathAir API",
    description="An API for tracking cities and their weather and air quality data",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(cities_router)

@app.get("/")
async def root():
    """
    Root endpoint that displays information about the API.
    """
    return {
        "message": "Welcome to WeathAir API!",
        "version": "1.0.0",
        "description": "An API for tracking cities and their weather and air quality data",
        "endpoints": {
            "/": "This page",
            "/cities": "GET - Fetch all cities",
            "/cities/{id}": "GET - Fetch a specific city",
            "/cities": "POST - Create a new city",
            "/cities/{id}": "PUT - Update a city",
            "/cities/{id}": "DELETE - Delete a city",
            "/docs": "Swagger UI - Interactive API documentation",
            "/redoc": "ReDoc - Alternative API documentation"
        }
    }

@app.get("/health")
async def health_check():
    """
    Health check endpoint to verify the server is running.
    """
    return {"status": "healthy", "message": "WeathAir API is up and running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)