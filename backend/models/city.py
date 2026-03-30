from sqlalchemy import Column, Integer, String, Float
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

    def __repr__(self):
        return f"<City(id={self.id}, name='{self.name}')>"