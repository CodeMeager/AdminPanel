import React, { useState } from 'react'
import ConfirmModal from '../ConfirmModal'

// Общий компонент для вкладок «Меню» и «Бизнес-ланч»
export default function MenuTab({ categories, initialItems, onToast }) {
  const [items, setItems] = useState(initialItems)
  const [modal, setModal] = useState(null)   // null | { mode: 'add'|'edit', categoryId, item? }
  const [confirm, setConfirm] = useState(null) // null | { itemId }
  const [form, setForm] = useState({})

  // ── Открыть модалку добавления ──
  function openAdd(categoryId) {
    setForm({ name: '', description: '', price: '', weight: '' })
    setModal({ mode: 'add', categoryId })
  }

  // ── Открыть модалку редактирования ──
  function openEdit(item) {
    setForm({ name: item.name, description: item.description, price: item.price, weight: item.weight })
    setModal({ mode: 'edit', categoryId: item.category_id, item })
  }

  // ── Сохранить блюдо ──
  function handleSave() {
    if (!form.name.trim()) return
    if (modal.mode === 'add') {
      const newItem = {
        id: Date.now(),
        category_id: modal.categoryId,
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price) || 0,
        weight: form.weight.trim(),
      }
      setItems(prev => [...prev, newItem])
      onToast('Блюдо добавлено')
    } else {
      setItems(prev => prev.map(it =>
        it.id === modal.item.id
          ? { ...it, name: form.name.trim(), description: form.description.trim(), price: Number(form.price) || 0, weight: form.weight.trim() }
          : it
      ))
      onToast('Блюдо сохранено')
    }
    setModal(null)
  }

  // ── Удалить блюдо ──
  function handleDelete() {
    setItems(prev => prev.filter(it => it.id !== confirm.itemId))
    setConfirm(null)
    onToast('Блюдо удалено', 'error')
  }

  return (
    <div>
      {categories.map(cat => {
        const catItems = items.filter(it => it.category_id === cat.id)
        return (
          <div key={cat.id} className="menu-category">
            <div className="menu-category-title">
              <span>{cat.name}</span>
              <button className="btn btn-primary btn-sm" onClick={() => openAdd(cat.id)}>
                + Добавить блюдо
              </button>
            </div>
            <table className="menu-table">
              <thead>
                <tr>
                  <th>Название</th>
                  <th>Описание</th>
                  <th>Цена ₽</th>
                  <th>Вес/объём</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {catItems.length === 0
                  ? <tr className="empty-row"><td colSpan={5}>Блюд нет — добавьте первое</td></tr>
                  : catItems.map(item => (
                    <tr key={item.id}>
                      <td><strong>{item.name}</strong></td>
                      <td className="text-muted">{item.description}</td>
                      <td>{item.price} ₽</td>
                      <td>{item.weight}</td>
                      <td>
                        <div className="actions">
                          <button className="btn-icon" title="Редактировать" onClick={() => openEdit(item)}>✏️</button>
                          <button className="btn-icon" title="Удалить" onClick={() => setConfirm({ itemId: item.id })}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        )
      })}

      {/* Модалка добавления / редактирования */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModal(null)}>×</button>
            <h2>{modal.mode === 'add' ? 'Новое блюдо' : 'Редактировать блюдо'}</h2>

            <div className="form-field">
              <label>Название *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Название блюда" />
            </div>
            <div className="form-field">
              <label>Описание</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Краткое описание" />
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Цена ₽</label>
                <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="0" min="0" />
              </div>
              <div className="form-field">
                <label>Вес / объём</label>
                <input value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} placeholder="150 г" />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setModal(null)}>Отмена</button>
              <button className="btn btn-primary" onClick={handleSave}>Сохранить</button>
            </div>
          </div>
        </div>
      )}

      {/* Диалог удаления */}
      {confirm && (
        <ConfirmModal
          message="Вы уверены, что хотите удалить это блюдо?"
          onConfirm={handleDelete}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  )
}
