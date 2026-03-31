from pydantic import BaseModel, Field, field_validator
from typing import Optional

class CityBase(BaseModel):
    """
    Base schema for City containing common fields.
    This is used as a base for other schemas.
    """
    name: str = Field(..., min_length=2, max_length=50, description="City's name")
    country: str = Field(..., min_length=2, max_length=50, description="Country's name")
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    is_favorite: bool = Field(False, description="Mark city as favorite")

    @field_validator('name')
    @classmethod
    def name_must_not_be_empty(cls, v: str) -> str:
        """Validates that the name is not just whitespace"""
        if not v.strip():
            raise ValueError("Name cannot be empty or only whitespace")
        return v.strip()
    
class CityCreate(CityBase):
    pass

class CityUpdate(BaseModel):
    """
    Schema for updating a city.
    All fields are optional so you can update only what you want.
    """
    name: Optional[str] = Field(None, min_length=2, max_length=50)
    country: Optional[str] = Field(None, min_length=2, max_length=255)
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)
    is_favorite: Optional[bool] = Field(None)

class CityResponse(CityBase):
    """
    Schema for API response when returning a city.
    Contains all fields.
    """
    id: int = Field(..., description="City's unique ID")
    class Config: 
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "name" : "Stockholm",
                "country" : "Sweden",
                "latitude" : 59.325,
                "longitude" : 18.05,
                "is_favorite" : False
            }
        }