import React, { useState, useEffect } from 'react'
import { roomPages, equipmentInRoom, equipmentDisposable } from '../../data/mockData'
import Spinner from '../Spinner'

const MAX_PHOTOS = 12

export default function RoomPage({ room, onBack, onToast }) {
  // ─── LOADING_STATE: заменить на fetch('/admin/api.php?action=get_room_page') ───
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState(null)

  useEffect(() => {
    const t = setTimeout(() => {
      setData(roomPages[room.id] || {
        room_id: room.id,
        gallery: [],
        preview_index: 0,
        full_description: '',
        bed_type: '',
        equipment_in_room: [],
        equipment_disposable: [],
      })
      setLoading(false)
    }, 600) // заменить на реальный fetch
    return () => clearTimeout(t)
  }, [room.id])
  // ──────────────────────────────────────────────────────────────────────────

  const [errors, setErrors] = useState({})

  function handlePhotoUpload(e) {
    const files = Array.from(e.target.files)
    const remaining = MAX_PHOTOS - data.gallery.length
    const toAdd = files.slice(0, remaining).map(f => URL.createObjectURL(f))
    setData(d => ({ ...d, gallery: [...d.gallery, ...toAdd] }))
    setErrors(e => ({ ...e, gallery: undefined }))
  }

  function removePhoto(idx) {
    setData(d => {
      const gallery = d.gallery.filter((_, i) => i !== idx)
      const preview_index = d.preview_index >= gallery.length ? 0 : d.preview_index
      return { ...d, gallery, preview_index }
    })
  }

  function setPreview(idx) {
    setData(d => ({ ...d, preview_index: idx }))
  }

  function toggleEquip(list, item) {
    setData(d => ({
      ...d,
      [list]: d[list].includes(item) ? d[list].filter(x => x !== item) : [...d[list], item],
    }))
    setErrors(e => ({ ...e, [list]: undefined }))
  }

  function setTextField(key, value) {
    setData(d => ({ ...d, [key]: value }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: undefined }))
  }

  function validate() {
    const e = {}
    if (data.gallery.length === 0)
      e.gallery = 'Загрузите хотя бы одно фото'
    if (!data.full_description.trim())
      e.full_description = 'Введите описание номера'
    if (!data.bed_type.trim())
      e.bed_type = 'Введите тип кровати'
    if (data.equipment_in_room.length === 0)
      e.equipment_in_room = 'Отметьте хотя бы один пункт'
    if (data.equipment_disposable.length === 0)
      e.equipment_disposable = 'Отметьте хотя бы один пункт'
    return e
  }

  function handleSave() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }

    // ─── LOADING_STATE: заменить на fetch('/admin/api.php?action=save_room_page') ───
    setSaving(true)
    setTimeout(() => {
      onToast('Страница номера сохранена')
      setSaving(false)
    }, 500) // заменить на реальный fetch
    // ──────────────────────────────────────────────────────────────────────────
  }

  if (loading) return (
    <div className="room-page">
      <div className="room-page-back">
        <button className="btn btn-outline" onClick={onBack}>← Назад к номерам</button>
      </div>
      <Spinner text="Загружаем страницу номера..." />
    </div>
  )

  return (
    <div className="room-page">
      <div className="room-page-back">
        <button className="btn btn-outline" onClick={onBack}>← Назад к номерам</button>
      </div>
      <h2>Страница номера: {room.name}</h2>

      {/* ── Галерея ── */}
      <div className="room-page-section">
        <h3>Галерея (до {MAX_PHOTOS} фото) <span className="required-mark">*</span></h3>
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
          <label className="upload-btn-label mt-8">
            📷 Загрузить фото
            <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} />
          </label>
        )}
        {errors.gallery && <span className="field-error mt-8">{errors.gallery}</span>}
      </div>

      {/* ── Описание ── */}
      <div className="room-page-section">
        <h3>Описание номера <span className="required-mark">*</span></h3>
        <textarea
          className={`field-input ${errors.full_description ? 'input-error' : ''}`}
          rows={5}
          value={data.full_description}
          onChange={e => setTextField('full_description', e.target.value)}
          placeholder="Подробное описание номера..."
        />
        {errors.full_description && <span className="field-error">{errors.full_description}</span>}
      </div>

      {/* ── Тип кровати ── */}
      <div className="room-page-section">
        <h3>Тип кровати <span className="required-mark">*</span></h3>
        <input
          className={`field-input ${errors.bed_type ? 'input-error' : ''}`}
          value={data.bed_type}
          onChange={e => setTextField('bed_type', e.target.value)}
          placeholder="Напр: King-size, 2-спальная..."
          style={{ maxWidth: 320 }}
        />
        {errors.bed_type && <span className="field-error">{errors.bed_type}</span>}
      </div>

      {/* ── Оснащение: В номере ── */}
      <div className="room-page-section">
        <h3>Оснащение: В номере <span className="required-mark">*</span></h3>
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
        {errors.equipment_in_room && <span className="field-error mt-8">{errors.equipment_in_room}</span>}
      </div>

      {/* ── Оснащение: Одноразовая продукция ── */}
      <div className="room-page-section">
        <h3>Оснащение: Одноразовая продукция <span className="required-mark">*</span></h3>
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
        {errors.equipment_disposable && <span className="field-error mt-8">{errors.equipment_disposable}</span>}
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <button
          className={`btn btn-primary ${saving ? 'btn-loading' : ''}`}
          onClick={handleSave}
        >
          {saving ? 'Сохранение...' : '💾 Сохранить'}
        </button>
        <button className="btn btn-outline" onClick={onBack}>Назад к номерам</button>
      </div>
    </div>
  )
}
