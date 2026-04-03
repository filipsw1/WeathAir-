const BASE_URL = "http://localhost:8000"
const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast"
const AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1/air-quality"

export async function getCities() {
    const response = await fetch(`${BASE_URL}/cities`)
    if (!response.ok) throw new Error("Failed to fetch cities")
        return response.json()
}

export async function getCity(id) {
  const response = await fetch(`${BASE_URL}/cities/${id}`)
  if (!response.ok) throw new Error("Failed to fetch city")
  return response.json()
}

export async function createCity(cityData) {
    const response = await fetch (`${BASE_URL}/cities/`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(cityData)
    })
    if (!response.ok) throw new Error("Failed to create city")
    return response.json()
}

export async function updateCity(id, cityData) {
    const response = await fetch(`${BASE_URL}/cities/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(cityData)
    })
    if (!response.ok) throw new Error("Failed to update city")
    return response.json()
}

export async function deleteCity(id) {
  const response = await fetch(`${BASE_URL}/cities/${id}`, {
    method: "DELETE"
  })
  if (!response.ok) throw new Error("Failed to delete city")
}

// geo

export async function searchCity(query) {
    const response = await fetch(`${GEOCODING_URL}?name=${encodeURIComponent(query)}&count=5&language=en`)
    if (!response.ok) throw new Error("Failed to search city")
    const data = await response.json()
    return data.results || []
}

// weather + air quality

export async function getWeatherAndAirQuality(latitude, longitude) {
  const [weatherResponse, airResponse] = await Promise.all([
    fetch(
      `${WEATHER_URL}?latitude=${latitude}&longitude=${longitude}` +
      `&current=temperature_2m,wind_speed_10m,precipitation` +
      `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode` +
      `&forecast_days=7` +
      `&timezone=auto`
    ),
    fetch(
      `${AIR_QUALITY_URL}?latitude=${latitude}&longitude=${longitude}` +
      `&current=pm2_5,pm10,us_aqi`
    )
  ])

  if (!weatherResponse.ok) throw new Error("Failed to fetch weather")
  if (!airResponse.ok) throw new Error("Failed to fetch air quality")

  const weather = await weatherResponse.json()
  const air = await airResponse.json()

  return {
    temperature: weather.current.temperature_2m,
    windSpeed: weather.current.wind_speed_10m,
    precipitation: weather.current.precipitation,
    forecast: weather.daily.time.map((date, i) => ({
      date,
      maxTemp: weather.daily.temperature_2m_max[i],
      minTemp: weather.daily.temperature_2m_min[i],
      precipitation: weather.daily.precipitation_sum[i],
      weathercode: weather.daily.weathercode[i]
    })),
    pm25: air.current.pm2_5,
    pm10: air.current.pm10,
    aqi: air.current.us_aqi
  }
}
