import CityCard from "./CityCard"

export default function CityList({ cities, onSelectCity, onDeleteCity, onUpdate }) {
  if (cities.length === 0) {
    return (
      <div className="city-list-empty">
        <p>No favorites yet</p>
        <p>Search for a city and click ☆ to save it</p>
      </div>
    )
  }

  return (
    <div className="city-list">
      {cities.map(city => (
        <CityCard
          key={city.id}
          city={city}
          onSelect={() => onSelectCity(city)}
          onDelete={() => onDeleteCity(city.id)}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  )
}