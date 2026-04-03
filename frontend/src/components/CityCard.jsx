import { useState, useEffect } from "react"
import { updateCity } from "../api/cities"
import { Pencil, Trash2, Check, X } from "lucide-react"

export default function CityCard({ city, onSelect, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [nickname, setNickname] = useState(city.nickname || "")

  useEffect(() => {
    setNickname(city.nickname || "")
  }, [city.nickname])

  async function handleSave() {
    try {
      const updated = await updateCity(city.id, {
        nickname: nickname.trim() || null
      })
      onUpdate(updated)
      setEditing(false)
    } catch (err) {
      console.error("Save failed:", err)
    }
  }

  const displayName = city.nickname || city.name

  return (
    <div className="city-card" onClick={!editing ? onSelect : undefined}>
      <div className="city-card__info">
        {editing ? (
          <input
            className="nickname-input"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            onClick={e => e.stopPropagation()}
            placeholder={city.name}
            autoFocus
          />
        ) : (
          <span className="city-card__name">{displayName}</span>
        )}
        <span className="city-card__country">
          {city.state && city.state !== city.name ? `${city.state}, ` : ""}{city.country}
        </span>
      </div>

      <div className="city-card__actions">
        {editing ? (
          <>
            <button className="btn-save" onClick={e => { e.stopPropagation(); handleSave() }}>
              <Check size={14} />
            </button>
            <button className="btn-cancel" onClick={e => { e.stopPropagation(); setEditing(false) }}>
              <X size={14} />
            </button>
          </>
        ) : (
          <>
            <button className="btn-edit" onClick={e => { e.stopPropagation(); setEditing(true) }}>
              <Pencil size={14} />
            </button>
            <button className="btn-delete" onClick={e => { e.stopPropagation(); onDelete() }}>
              <Trash2 size={14} />
            </button>
          </>
        )}
      </div>
    </div>
  )
}