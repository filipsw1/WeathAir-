import { useState, useEffect } from "react"
import { getCities, deleteCity, createCity } from "./api/cities"
import { Cloud } from "lucide-react"
import CityList from "./components/CityList"
import AddCityForm from "./components/AddCityForm"
import WeatherDetail from "./components/WeatherDetail"
import CurrentLocation from "./components/CurrentLocation"
import "./App.css"

export default function App() {
  const [favorites, setFavorites] = useState([])
  const [previewCity, setPreviewCity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchFavorites()
  }, [])

  async function fetchFavorites() {
    try {
      setLoading(true)
      const data = await getCities()
      setFavorites(data)
    } catch (err) {
      setError("Could not load favorites")
    } finally {
      setLoading(false)
    }
  }

  function handleCitySearch(cityResult) {
    setPreviewCity(cityResult)
  }

  async function handleAddFavorite(cityData) {
    try {
      const newCity = await createCity({
        name: cityData.name,
        country: cityData.country,
        latitude: cityData.latitude,
        longitude: cityData.longitude,
        is_favorite: true,
        state: cityData.state || null
      })
      setFavorites(prev => [...prev, newCity])
    } catch (err) {
      if (err.message.includes("already exists")) {
        setError(`${cityData.name} is already in your favorites`)
      } else {
        setError("Could not add to favorites")
      }
      setTimeout(() => setError(null), 3000)
    }
  }

  async function handleDeleteFavorite(id) {
    try {
      await deleteCity(id)
      setFavorites(prev => prev.filter(city => city.id !== id))
    } catch (err) {
      setError("Could not remove favorite")
    }
  }

  async function handleUpdateCity(updatedCity) {
    setFavorites(prev => prev.map(c => c.id === updatedCity.id ? updatedCity : c))
    if (previewCity?.id === updatedCity.id) {
      setPreviewCity(updatedCity)
    }
  }

  const isAlreadyFavorite = previewCity
    ? favorites.some(f =>
        f.name === previewCity.name &&
        f.latitude === previewCity.latitude
      )
    : false

  return (
    <div className="app">
      <header className="app-header">
        <div
          className="app-logo"
          onClick={() => setPreviewCity(null)}
          style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <Cloud size={28} />
          <h1>WeathAir</h1>
        </div>
        <p>Track weather and air quality</p>
      </header>

      <main className="app-main">
        <div className="app-sidebar">
          <AddCityForm onCitySearch={handleCitySearch} />
          {error && <p className="status-text error">{error}</p>}
          <div className="favorites-section">
            <h2 className="section-title">Favorites</h2>
            {loading && <p className="status-text">Loading...</p>}
            <CityList
              cities={favorites}
              onSelectCity={(city) => setPreviewCity(city)}
              onDeleteCity={handleDeleteFavorite}
              onUpdate={handleUpdateCity}
            />
          </div>
        </div>

        <div className="app-content">
          {previewCity ? (
            <WeatherDetail
              city={previewCity}
              isFavorite={isAlreadyFavorite}
              onAddFavorite={() => handleAddFavorite(previewCity)}
              onRemoveFavorite={() => {
                const fav = favorites.find(f =>
                  f.name === previewCity.name &&
                  f.latitude === previewCity.latitude &&
                  f.longitude === previewCity.longitude
                )
                if (fav) handleDeleteFavorite(fav.id)
              }}
            />
          ) : (
            <CurrentLocation />
          )}
        </div>
      </main>
    </div>
  )
}