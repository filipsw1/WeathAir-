import { useState, useEffect } from "react"
import { getWeatherAndAirQuality } from "../api/cities"
import {
  Thermometer,
  Wind,
  Calendar,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Star
} from "lucide-react"

function getAirQualityInfo(aqi) {
  if (aqi === null || aqi === undefined) return { level: "Unknown", color: "#888", warning: null }
  if (aqi <= 50)  return { level: "Good",           color: "#22c55e", warning: null }
  if (aqi <= 100) return { level: "Moderate",       color: "#eab308", warning: null }
  if (aqi <= 150) return { level: "Unhealthy for sensitive groups", color: "#f97316", warning: "Sensitive groups should avoid outdoor activity" }
  if (aqi <= 200) return { level: "Unhealthy",      color: "#ef4444", warning: "Limit outdoor activity" }
  if (aqi <= 300) return { level: "Very Unhealthy", color: "#a855f7", warning: "Avoid outdoor activity" }
  return                 { level: "Hazardous",       color: "#7f1d1d", warning: "Stay indoors!" }
}

function getWeatherIcon(code) {
  if (code === 0)  return <Sun size={24} color="#f59e0b" />
  if (code <= 2)   return <Sun size={24} color="#f59e0b" />
  if (code <= 3)   return <Cloud size={24} color="#9ca3af" />
  if (code <= 49)  return <Cloud size={24} color="#9ca3af" />
  if (code <= 69)  return <CloudRain size={24} color="#60a5fa" />
  if (code <= 79)  return <CloudSnow size={24} color="#bfdbfe" />
  if (code <= 99)  return <CloudLightning size={24} color="#a78bfa" />
  return <Thermometer size={24} />
}

export default function WeatherDetail({ city, isFavorite, onAddFavorite, onRemoveFavorite }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!city) return
    fetchData()
  }, [city])

  async function fetchData() {
    try {
      setLoading(true)
      setError(null)
      const result = await getWeatherAndAirQuality(city.latitude, city.longitude)
      setData(result)
    } catch (err) {
      setError("Could not load weather data")
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="weather-detail"><p>Loading weather data...</p></div>
  if (error)   return <div className="weather-detail"><p className="error">{error}</p></div>
  if (!data)   return null

  const aqiInfo = getAirQualityInfo(data.aqi)

  return (
    <div className="weather-detail">
      <div className="weather-detail__header">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <h2>
            {city.nickname || city.name}
            {city.state && city.state !== city.name ? `, ${city.state}` : ""}, {city.country}
          </h2>
          <button
            className={`btn-favorite-large ${isFavorite ? "btn-favorite-large--active" : ""}`}
            onClick={isFavorite ? onRemoveFavorite : onAddFavorite}
          >
            <Star size={14} fill={isFavorite ? "currentColor" : "none"} />
            {isFavorite ? " Saved" : " Save to favorites"}
          </button>
        </div>
      </div>

      <div className="weather-detail__body">
        <div>
          <div className="weather-section">
            <h3><Thermometer size={14} /> Weather</h3>
            <div className="weather-grid">
              <div className="weather-item">
                <span className="weather-label">Temperature</span>
                <span className="weather-value">{data.temperature}°C</span>
              </div>
              <div className="weather-item">
                <span className="weather-label">Wind Speed</span>
                <span className="weather-value">{data.windSpeed} km/h</span>
              </div>
              <div className="weather-item">
                <span className="weather-label">Precipitation</span>
                <span className="weather-value">{data.precipitation} mm</span>
              </div>
            </div>
          </div>

          <div className="weather-section">
            <h3><Wind size={14} /> Air Quality</h3>
            <div className="aqi-display">
              <span className="aqi-value" style={{ color: aqiInfo.color }}>{data.aqi}</span>
              <span className="aqi-level" style={{ color: aqiInfo.color }}>{aqiInfo.level}</span>
            </div>
            {aqiInfo.warning && <div className="aqi-warning">{aqiInfo.warning}</div>}
            <div className="weather-grid">
              <div className="weather-item">
                <span className="weather-label">PM2.5</span>
                <span className="weather-value">{data.pm25} µg/m³</span>
              </div>
              <div className="weather-item">
                <span className="weather-label">PM10</span>
                <span className="weather-value">{data.pm10} µg/m³</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="weather-section">
            <h3><Calendar size={14} /> Forecast</h3>
            <div className="forecast-grid">
              {data.forecast.map((day, i) => (
                <div key={i} className="forecast-day">
                  <span className="forecast-date">
                    {i === 0 ? "Today" : new Date(day.date).toLocaleDateString("en", { weekday: "short" })}
                  </span>
                  <span className="forecast-icon">{getWeatherIcon(day.weathercode)}</span>
                  <span className="forecast-temp">
                    {Math.round(day.maxTemp)}° / {Math.round(day.minTemp)}°
                  </span>
                  <span className="forecast-precip">{day.precipitation} mm</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}