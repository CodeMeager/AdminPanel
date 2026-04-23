import React, { useState } from 'react'
import ConfirmModal from '../ConfirmModal'
import { roomTypes, amenitiesList, rooms as initialRooms } from '../../data/mockData'

// Форма добавления / редактирования карточки номера
function RoomModal({ room, onSave, onClose }) {
  const [form, setForm] = useState(room
    ? { ...room, amenities: [...(room.amenities || [])] }
    : { type: 'Стандарт', name: '', description: '', count: '', area: '', price: '', amenities: [], photo: null }
  )
  const [photoPreview, setPhotoPreview] = useState(room?.photo || null)

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
  }

  function handleSave() {
    if (!form.name.trim()) return
    onSave({
      ...form,
      count: Number(form.count) || 0,
      area:  Number(form.area)  || 0,
      price: Number(form.price) || 0,
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ width: 580, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>{room ? 'Редактировать номер' : 'Новый номер'}</h2>

        <div className="form-field">
          <label>Тип номера</label>
          <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
            {roomTypes.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="form-field">
          <label>Название *</label>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Напр: Стандарт одноместный" />
        </div>
        <div className="form-field">
          <label>Краткое описание</label>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Пара предложений" />
        </div>
        <div className="form-row">
          <div className="form-field">
            <label>Кол-во номеров</label>
            <input type="number" value={form.count} onChange={e => setForm(f => ({ ...f, count: e.target.value }))} min="0" />
          </div>
          <div className="form-field">
            <label>Площадь м²</label>
            <input type="number" value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))} min="0" />
          </div>
          <div className="form-field">
            <label>Цена ₽/сут</label>
            <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} min="0" />
          </div>
        </div>

        {/* Фото */}
        <div className="form-field">
          <label>Фото</label>
          <label className="photo-upload-label">
            {photoPreview
              ? <img src={photoPreview} className="photo-preview" alt="preview" />
              : <><span style={{ fontSize: 28 }}>📷</span><span>Нажмите для выбора фото</span></>
            }
            <input type="file" accept="image/*" onChange={handlePhoto} />
          </label>
        </div>

        {/* Плюшки */}
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
          <button className="btn btn-primary" onClick={handleSave}>Сохранить</button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

export default function RoomsTab({ onToast, onOpenRoomPage }) {
  const [rooms, setRooms] = useState(initialRooms)
  const [modal, setModal] = useState(null)   // null | { mode: 'add'|'edit', room? }
  const [confirm, setConfirm] = useState(null)

  function openAdd() {
    setModal({ mode: 'add' })
  }

  function openEdit(room) {
    setModal({ mode: 'edit', room })
  }

  function handleSave(formData) {
    if (modal.mode === 'add') {
      const newRoom = { ...formData, id: Date.now() }
      setRooms(prev => [...prev, newRoom])
      setModal(null)
      onToast('Номер добавлен')
      // После добавления — открываем редактор страницы номера
      onOpenRoomPage(newRoom)
    } else {
      setRooms(prev => prev.map(r => r.id === modal.room.id ? { ...r, ...formData } : r))
      setModal(null)
      onToast('Номер сохранён')
    }
  }

  function handleDelete() {
    setRooms(prev => prev.filter(r => r.id !== confirm.roomId))
    setConfirm(null)
    onToast('Номер удалён', 'error')
  }

  return (
    <div>
      <div className="section-header">
        <h2>Номера</h2>
        <button className="btn btn-primary" onClick={openAdd}>+ Добавить номер</button>
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
              <button className="btn btn-outline btn-sm" onClick={() => openEdit(room)}>✏️ Редактировать</button>
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
