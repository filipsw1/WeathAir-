import { useState } from "react"
import { searchCity } from "../api/cities"

export default function AddCityForm({ onCitySearch }) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSearch(e) {
    e.preventDefault()
    if (!query.trim()) return

    try {
      setLoading(true)
      setError(null)
      const data = await searchCity(query)
      if (data.length === 0) setError("No cities found")
      setResults(data)
    } catch (err) {
      setError("Search failed, try again")
    } finally {
      setLoading(false)
    }
  }

  function handleSelect(result) {
    onCitySearch({
      name: result.name,
      country: result.country,
      latitude: result.latitude,
      longitude: result.longitude,
      state: result.admin1 || null
    })
    setQuery(result.name)
    setResults([])
  }

  return (
    <div className="add-city-form">
      <h2>Search</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search for a city..."
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? "..." : "Search"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {results.length > 0 && (
        <ul className="search-results">
          {results.map((result, index) => (
            <li key={index} onClick={() => handleSelect(result)}>
              <span className="result-name">{result.name}</span>
              <span className="result-country">
                {result.admin1 ? `${result.admin1}, ` : ""}{result.country}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}