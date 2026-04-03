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
  MapPin,
  AlertTriangle,
  ArrowBigDown 
} from "lucide-react"

function getAirQualityInfo(aqi) {
  if (aqi === null || aqi === undefined) return { level: "Unknown", color: "#888", warning: null }
  if (aqi <= 50)  return { level: "Good", color: "#22c55e", warning: null }
  if (aqi <= 100) return { level: "Moderate", color: "#eab308", warning: null }
  if (aqi <= 150) return { level: "Unhealthy for sensitive groups", color: "#f97316", warning: "Sensitive groups should avoid outdoor activity" }
  if (aqi <= 200) return { level: "Unhealthy", color: "#ef4444", warning: "Limit outdoor activity" }
  if (aqi <= 300) return { level: "Very Unhealthy", color: "#a855f7", warning: "Avoid outdoor activity" }
  return { level: "Hazardous", color: "#7f1d1d", warning: "Stay indoors!" }
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

export default function CurrentLocation() {
  const [data, setData] = useState(null)
  const [locationName, setLocationName] = useState("Your Location")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const result = await getWeatherAndAirQuality(latitude, longitude)
          setData(result)
          await fetchLocationName(latitude, longitude)
        } catch (err) {
          setError("Could not load weather for your location")
        } finally {
          setLoading(false)
        }
      },
      () => {
        setError("Location access denied")
        setLoading(false)
      }
    )
  }, [])

  async function fetchLocationName(lat, lon) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
        { headers: { "Accept-Language": "en", "User-Agent": "WeathAir/1.0" } }
      )
      const data = await response.json()
      if (data.address) {
        const city = data.address.city || data.address.town || data.address.village
        setLocationName(`${city}, ${data.address.country}`)
      }
    } catch {
      // Behåller "Your Location"
    }
  }

  if (loading) return <div className="weather-detail"><p>Detecting your location...</p></div>
  if (error)   return <div className="weather-detail"><p className="muted">{error}</p></div>
  if (!data)   return null

  const aqiInfo = getAirQualityInfo(data.aqi)

  return (
    <div className="weather-detail">
      <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <MapPin size={20} /> {locationName}
      </h2>
      <p className="current-location-label"> WeathAir right now <ArrowBigDown size={18} style={{ verticalAlign: "middle" }} /></p>

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
            {aqiInfo.warning && (
              <div className="aqi-warning">
                <AlertTriangle size={14} /> {aqiInfo.warning}
              </div>
            )}
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