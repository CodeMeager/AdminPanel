import React, { useState } from 'react'
import { roomPages, equipmentInRoom, equipmentDisposable } from '../../data/mockData'

const MAX_PHOTOS = 12

export default function RoomPage({ room, onBack, onToast }) {
  // Берём сохранённые данные страницы или создаём пустые для нового номера
  const initial = roomPages[room.id] || {
    room_id: room.id,
    gallery: [],
    preview_index: 0,
    full_description: '',
    bed_type: '',
    equipment_in_room: [],
    equipment_disposable: [],
  }

  const [data, setData] = useState(initial)

  // ── Галерея ──
  function handlePhotoUpload(e) {
    const files = Array.from(e.target.files)
    const remaining = MAX_PHOTOS - data.gallery.length
    const toAdd = files.slice(0, remaining).map(f => URL.createObjectURL(f))
    setData(d => ({ ...d, gallery: [...d.gallery, ...toAdd] }))
  }

  function removePhoto(idx) {
    setData(d => {
      const gallery = d.gallery.filter((_, i) => i !== idx)
      // если удалили превью — сбрасываем на 0
      const preview_index = d.preview_index >= gallery.length ? 0 : d.preview_index
      return { ...d, gallery, preview_index }
    })
  }

  function setPreview(idx) {
    setData(d => ({ ...d, preview_index: idx }))
  }

  // ── Чекбоксы оснащения ──
  function toggleEquip(list, item) {
    setData(d => ({
      ...d,
      [list]: d[list].includes(item) ? d[list].filter(x => x !== item) : [...d[list], item],
    }))
  }

  function handleSave() {
    // В будущем здесь — API-вызов. Пока просто показываем тост.
    onToast('Страница номера сохранена')
  }

  return (
    <div className="room-page">
      <div className="room-page-back">
        <button className="btn btn-outline" onClick={onBack}>← Назад к номерам</button>
      </div>
      <h2>Страница номера: {room.name}</h2>

      {/* ── Галерея ── */}
      <div className="room-page-section">
        <h3>Галерея (до {MAX_PHOTOS} фото)</h3>
        <p className="gallery-hint">Нажмите на фото, чтобы сделать его превью (выделено рамкой)</p>
        <div className="gallery-grid">
          {data.gallery.map((src, idx) => (
            <div
              key={idx}
              className={`gallery-item ${idx === data.preview_index ? 'preview-selected' : ''}`}
              onClick={() => setPreview(idx)}
              title="Нажмите для выбора превью"
            >
              <img src={src} alt={`Фото ${idx + 1}`} />
              <button
                className="del-photo"
                onClick={ev => { ev.stopPropagation(); removePhoto(idx) }}
                title="Удалить фото"
              >×</button>
            </div>
          ))}
          {data.gallery.length < MAX_PHOTOS && (
            <div className="gallery-placeholder">Нажмите «Загрузить» для добавления фото</div>
          )}
        </div>
        {data.gallery.length < MAX_PHOTOS && (
          <label className="upload-btn-label">
            📷 Загрузить фото
            <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} />
          </label>
        )}
      </div>

      {/* ── Описание ── */}
      <div className="room-page-section">
        <h3>Описание номера</h3>
        <textarea
          className="field-input"
          rows={5}
          value={data.full_description}
          onChange={e => setData(d => ({ ...d, full_description: e.target.value }))}
          placeholder="Подробное описание номера..."
        />
      </div>

      {/* ── Тип кровати ── */}
      <div className="room-page-section">
        <h3>Тип кровати</h3>
        <input
          className="field-input"
          value={data.bed_type}
          onChange={e => setData(d => ({ ...d, bed_type: e.target.value }))}
          placeholder="Напр: King-size, 2-спальная..."
          style={{ maxWidth: 320 }}
        />
      </div>

      {/* ── Оснащение ── */}
      <div className="room-page-section">
        <h3>Оснащение: В номере</h3>
        <div className="checkbox-grid">
          {equipmentInRoom.map(item => (
            <label key={item} className="checkbox-item">
              <input
                type="checkbox"
                checked={data.equipment_in_room.includes(item)}
                onChange={() => toggleEquip('equipment_in_room', item)}
              />
              {item}
            </label>
          ))}
        </div>
      </div>

      <div className="room-page-section">
        <h3>Оснащение: Одноразовая продукция</h3>
        <div className="checkbox-grid">
          {equipmentDisposable.map(item => (
            <label key={item} className="checkbox-item">
              <input
                type="checkbox"
                checked={data.equipment_disposable.includes(item)}
                onChange={() => toggleEquip('equipment_disposable', item)}
              />
              {item}
            </label>
          ))}
        </div>
      </div>

      {/* ── Кнопки ── */}
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <button className="btn btn-primary" onClick={handleSave}>💾 Сохранить</button>
        <button className="btn btn-outline" onClick={onBack}>Назад к номерам</button>
      </div>
    </div>
  )
}
