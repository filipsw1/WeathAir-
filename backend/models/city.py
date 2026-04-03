from sqlalchemy import Column, Integer, String, Float, Boolean
from database import Base


class City(Base):
    """
    SQLAlchemy model for the users table.
    This represents how data is stored in the MySQL database.
    """
    __tablename__ = "cities"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(50), nullable=False, index=True)
    country = Column(String(255), nullable=False) 
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    is_favorite = Column(Boolean, default=False, nullable=False)
    state       = Column(String(100), nullable=True)     
    nickname    = Column(String(100), nullable=True)     

    def __repr__(self):
        return f"<City(id={self.id}, name='{self.name}, favourite={self.is_favorite}')>"