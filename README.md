# WeathAir-
## Filip Silversten Wärn
Fullstack app to check weather and air quality 

## Starta backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```

## Starta frontend
```bash
cd frontend
npm install
npm run dev
```
## Endpoints
- POST /cities          Used to add a city to your favourites
- GET /cities           Used to get all your favourites
- GET /cities {id}      Used to get a specific city when clicking it from your favourites list
- PUT /cities{id}       Úsed to change the name or give a nickname to a city
- DELETE /cities/{id}   Used to delete a city from your favourites list

## Externa API:er
- Open-Meteo Weather API – weather right now and the upcoming 7 days
- Open-Meteo Air Quality API – AQI, PM2.5 och PM10
- Open-Meteo Geocoding API - for searching cities
- Nominatim – to get current position

## Tech Stack
Backend: FastAPI, SQLAlchemy, SQLite, Pydantic  
Frontend: React, Vite, Lucide React  
Databas: SQLite 

<img width="1909" height="779" alt="image" src="https://github.com/user-attachments/assets/f3c42828-1962-4fbb-a7ba-0935936cce37" />
