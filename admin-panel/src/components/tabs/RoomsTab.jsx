import React, { useState, useEffect } from 'react'
import ConfirmModal from '../ConfirmModal'
import Spinner from '../Spinner'
import { roomTypes, amenitiesList, rooms as initialRooms } from '../../data/mockData'

function RoomModal({ room, onSave, onClose }) {
  const [form, setForm] = useState(room
    ? { ...room, amenities: [...(room.amenities || [])] }
    : { type: 'Стандарт', name: '', description: '', count: '', area: '', price: '', amenities: [], photo: null }
  )
  const [photoPreview, setPhotoPreview] = useState(room?.photo || null)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  function setField(key, value) {
    setForm(f => ({ ...f, [key]: value }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: undefined }))
  }

  function toggleAmenity(a) {
    setForm(f => ({
      ...f,
      amenities: f.amenities.includes(a) ? f.amenities.filter(x => x !== a) : [...f.amenities, a],
    }))
  }

  function handlePhoto(e) {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPhotoPreview(url)
    setForm(f => ({ ...f, photo: url }))
    setErrors(e => ({ ...e, photo: undefined }))
  }

  function validate() {
    const e = {}
    if (!form.name.trim())         e.name        = 'Введите название номера'
    if (!form.description.trim())  e.description = 'Введите краткое описание'
    if (!form.count || Number(form.count) <= 0) e.count = 'Укажите количество номеров'
    if (!form.area  || Number(form.area)  <= 0) e.area  = 'Укажите площадь'
    if (!form.price || Number(form.price) <= 0) e.price = 'Укажите цену'
    if (!form.photo)               e.photo       = 'Загрузите фото номера'
    return e
  }

  function handleSave() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }

    // ─── LOADING_STATE: заменить на fetch('/admin/api.php?action=save_room') ───
    setSaving(true)
    setTimeout(() => {
      onSave({
        ...form,
        count: Number(form.count),
        area:  Number(form.area),
        price: Number(form.price),
      })
      setSaving(false)
    }, 400) // заменить на реальный fetch
    // ──────────────────────────────────────────────────────────────────────────
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ width: 580, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>{room ? 'Редактировать номер' : 'Новый номер'}</h2>

        <div className="form-field">
          <label>Тип номера</label>
          <select value={form.type} onChange={e => setField('type', e.target.value)}>
            {roomTypes.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        <div className="form-field">
          <label>Название <span className="required-mark">*</span></label>
          <input
            className={errors.name ? 'input-error' : ''}
            value={form.name}
            onChange={e => setField('name', e.target.value)}
            placeholder="Напр: Стандарт одноместный"
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="form-field">
          <label>Краткое описание <span className="required-mark">*</span></label>
          <textarea
            className={errors.description ? 'input-error' : ''}
            value={form.description}
            onChange={e => setField('description', e.target.value)}
            placeholder="Пара предложений"
          />
          {errors.description && <span className="field-error">{errors.description}</span>}
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>Кол-во номеров <span className="required-mark">*</span></label>
            <input
              type="number"
              className={errors.count ? 'input-error' : ''}
              value={form.count}
              onChange={e => setField('count', e.target.value)}
              min="1"
            />
            {errors.count && <span className="field-error">{errors.count}</span>}
          </div>
          <div className="form-field">
            <label>Площадь м² <span className="required-mark">*</span></label>
            <input
              type="number"
              className={errors.area ? 'input-error' : ''}
              value={form.area}
              onChange={e => setField('area', e.target.value)}
              min="1"
            />
            {errors.area && <span className="field-error">{errors.area}</span>}
          </div>
          <div className="form-field">
            <label>Цена ₽/сут <span className="required-mark">*</span></label>
            <input
              type="number"
              className={errors.price ? 'input-error' : ''}
              value={form.price}
              onChange={e => setField('price', e.target.value)}
              min="1"
            />
            {errors.price && <span className="field-error">{errors.price}</span>}
          </div>
        </div>

        <div className="form-field">
          <label>Фото <span className="required-mark">*</span></label>
          <label className={`photo-upload-label ${errors.photo ? 'input-error' : ''}`}>
            {photoPreview
              ? <img src={photoPreview} className="photo-preview" alt="preview" />
              : <><span style={{ fontSize: 28 }}>📷</span><span>Нажмите для выбора фото</span></>
            }
            <input type="file" accept="image/*" onChange={handlePhoto} />
          </label>
          {errors.photo && <span className="field-error">{errors.photo}</span>}
        </div>

        <div className="form-field">
          <label>Удобства</label>
          <div className="checkbox-grid mt-8">
            {amenitiesList.map(a => (
              <label key={a} className="checkbox-item">
                <input type="checkbox" checked={form.amenities.includes(a)} onChange={() => toggleAmenity(a)} />
                {a}
              </label>
            ))}
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onClose}>Отмена</button>
          <button
            className={`btn btn-primary ${saving ? 'btn-loading' : ''}`}
            onClick={handleSave}
          >
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

export default function RoomsTab({ onToast, onOpenRoomPage }) {
  // ─── LOADING_STATE: заменить на fetch('/admin/api.php?action=get_rooms') ───
  const [loading, setLoading] = useState(true)
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    const t = setTimeout(() => {
      setRooms(initialRooms)
      setLoading(false)
    }, 700) // заменить на реальный fetch
    return () => clearTimeout(t)
  }, [])
  // ──────────────────────────────────────────────────────────────────────────

  const [modal, setModal] = useState(null)
  const [confirm, setConfirm] = useState(null)

  function handleSave(formData) {
    if (modal.mode === 'add') {
      const newRoom = { ...formData, id: Date.now() }
      setRooms(prev => [...prev, newRoom])
      setModal(null)
      onToast('Номер добавлен')
      onOpenRoomPage(newRoom)
    } else {
      setRooms(prev => prev.map(r => r.id === modal.room.id ? { ...r, ...formData } : r))
      setModal(null)
      onToast('Номер сохранён')
    }
  }

  function handleDelete() {
    // ─── LOADING_STATE: заменить на fetch('/admin/api.php?action=delete_room') ───
    setTimeout(() => {
      setRooms(prev => prev.filter(r => r.id !== confirm.roomId))
      onToast('Номер удалён', 'error')
    }, 300) // заменить на реальный fetch
    // ──────────────────────────────────────────────────────────────────────────
    setConfirm(null)
  }

  if (loading) return <Spinner text="Загружаем номера..." />

  return (
    <div>
      <div className="section-header">
        <h2>Номера</h2>
        <button className="btn btn-primary" onClick={() => setModal({ mode: 'add' })}>+ Добавить номер</button>
      </div>

      <div className="rooms-grid">
        {rooms.map(room => (
          <div key={room.id} className="room-card">
            <div className="room-card-photo">
              {room.photo
                ? <img src={room.photo} alt={room.name} />
                : <span>Нет фото</span>
              }
            </div>
            <div className="room-card-body">
              <span className="room-card-type">{room.type}</span>
              <div className="room-card-name">{room.name}</div>
              <div className="room-card-desc">{room.description}</div>
              <div className="room-card-meta">
                <span>🛏 {room.count} шт.</span>
                <span>📐 {room.area} м²</span>
              </div>
              <div className="room-amenities">
                {room.amenities.slice(0, 5).map(a => <span key={a} className="amenity-tag">{a}</span>)}
                {room.amenities.length > 5 && <span className="amenity-tag">+{room.amenities.length - 5}</span>}
              </div>
              <div className="room-card-price">{room.price.toLocaleString('ru')} ₽/сут</div>
            </div>
            <div className="room-card-actions">
              <button className="btn btn-outline btn-sm" onClick={() => setModal({ mode: 'edit', room })}>✏️ Редактировать</button>
              <button className="btn btn-outline btn-sm" onClick={() => onOpenRoomPage(room)}>📄 Страница</button>
              <button className="btn btn-icon" title="Удалить" onClick={() => setConfirm({ roomId: room.id })}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <RoomModal
          room={modal.room || null}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {confirm && (
        <ConfirmModal
          message="Вы уверены, что хотите удалить этот номер?"
          onConfirm={handleDelete}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  )
}
