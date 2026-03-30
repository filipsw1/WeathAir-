from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.city import City
from schemas.city import CityCreate, CityUpdate, CityResponse

# Create a router for city endpoints
router = APIRouter(
    prefix="/cities",
    tags=["cities"]
)

@router.get("/", response_model=List[CityResponse])
async def get_cities(db: Session = Depends(get_db)):
    """
    Fetches all cities from the database.

    Returns:
        List of all cities
    """
    cities = db.query(City).all()
    print(f"Fetched {len(cities)} cities from database")
    return cities

@router.get("/{city_id}", response_model=CityResponse)
async def get_city(city_id: int, db: Session = Depends(get_db)):
    """
    Fetches a specific city by ID.

    Args:
        city_id: ID of the city to fetch
        db: Database session (injected by FastAPI)

    Returns:
        The requested city

    Raises:
        HTTPException: 404 if the city is not found
    """
    city = db.query(City).filter(City.id == city_id).first()
    if not city:
        print(f"City with ID {city_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"City with ID {city_id} not found"
        )

    print(f"Fetched city: {city.name} (ID: {city.id})")
    return city

@router.post("/", response_model=CityResponse, status_code=status.HTTP_201_CREATED)
async def create_city(city: CityCreate, db: Session = Depends(get_db)):
    """
    Creates a new city.

    Args:
        city: CityCreate schema with city data
        db: Database session (injected by FastAPI)

    Returns:
        The newly created city

    Raises:
        HTTPException: 400 if a city with same name and coordinates already exists
    """
    # Check if exact city already exists (same name AND coordinates)
    existing_city = db.query(City).filter(
        City.name == city.name,
        City.latitude == city.latitude,
        City.longitude == city.longitude
    ).first()
    if existing_city:
        print(f"Attempted to add city that already exists: {city.name}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"City '{city.name}' with these coordinates already exists"
        )

    db_city = City(
        name=city.name,
        country=city.country,
        latitude=city.latitude,
        longitude=city.longitude
    )
    db.add(db_city)
    db.commit()
    db.refresh(db_city)

    print(f"Added new city: {db_city.name} (ID: {db_city.id})")
    return db_city

@router.put("/{city_id}", response_model=CityResponse)
async def update_city(city_id: int, city_data: CityUpdate, db: Session = Depends(get_db)):
    """
    Updates a city.

    Args:
        city_id: ID of the city to update
        city_data: CityUpdate schema with fields to update
        db: Database session (injected by FastAPI)

    Returns:
        The updated city

    Raises:
        HTTPException: 404 if the city is not found
    """
    city = db.query(City).filter(City.id == city_id).first()
    if not city:
        print(f"City with ID {city_id} not found for update")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"City with ID {city_id} not found"
        )

    update_data = city_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(city, field, value)

    db.commit()
    db.refresh(city)

    print(f"Updated city: {city.name} (ID: {city.id})")
    return city

@router.delete("/{city_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_city(city_id: int, db: Session = Depends(get_db)):
    """
    Deletes a city.

    Args:
        city_id: ID of the city to delete
        db: Database session (injected by FastAPI)

    Raises:
        HTTPException: 404 if the city is not found
    """
    city = db.query(City).filter(City.id == city_id).first()
    if not city:
        print(f"City with ID {city_id} not found for deletion")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"City with ID {city_id} not found"
        )

    db.delete(city)
    db.commit()

    print(f"Deleted city: {city.name} (ID: {city_id})")
    return None