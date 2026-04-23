import React, { useState, useEffect } from 'react'
import ConfirmModal from '../ConfirmModal'
import Spinner from '../Spinner'

// showWeight — показывать ли поле «Вес/объём» (для бизнес-ланча передаётся false)
export default function MenuTab({ categories, initialItems, onToast, showWeight = true }) {
  // ─── LOADING_STATE: заменить на fetch('/admin/api.php?action=get_menu_items') ───
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [items, setItems] = useState([])

  useEffect(() => {
    const t = setTimeout(() => {
      setItems(initialItems)
      setLoading(false)
    }, 600) // заменить на реальный fetch
    return () => clearTimeout(t)
  }, [initialItems])
  // ─────────────────────────────────────────────────────────────────────────────

  const [modal, setModal] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [form, setForm] = useState({})
  const [errors, setErrors] = useState({})

  function openAdd(categoryId) {
    setForm({ name: '', description: '', price: '', weight: '' })
    setErrors({})
    setModal({ mode: 'add', categoryId })
  }

  function openEdit(item) {
    setForm({ name: item.name, description: item.description, price: item.price, weight: item.weight })
    setErrors({})
    setModal({ mode: 'edit', categoryId: item.category_id, item })
  }

  function validate() {
    const e = {}
    if (!form.name.trim())
      e.name = 'Введите название блюда'
    if (!form.description.trim())
      e.description = 'Введите описание'
    if (!form.price || Number(form.price) <= 0)
      e.price = 'Введите цену больше нуля'
    if (showWeight && !form.weight.trim())
      e.weight = 'Введите вес или объём'
    return e
  }

  function handleSave() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }

    // ─── LOADING_STATE: заменить на fetch('/admin/api.php?action=save_menu_item') ───
    setSaving(true)
    setTimeout(() => {
      if (modal.mode === 'add') {
        setItems(prev => [...prev, {
          id: Date.now(),
          category_id: modal.categoryId,
          name: form.name.trim(),
          description: form.description.trim(),
          price: Number(form.price),
          weight: form.weight.trim(),
        }])
        onToast('Блюдо добавлено')
      } else {
        setItems(prev => prev.map(it =>
          it.id === modal.item.id
            ? { ...it, name: form.name.trim(), description: form.description.trim(), price: Number(form.price), weight: form.weight.trim() }
            : it
        ))
        onToast('Блюдо сохранено')
      }
      setSaving(false)
      setModal(null)
    }, 400) // заменить на реальный fetch
    // ─────────────────────────────────────────────────────────────────────────────
  }

  function handleDelete() {
    // ─── LOADING_STATE: заменить на fetch('/admin/api.php?action=delete_menu_item') ───
    setTimeout(() => {
      setItems(prev => prev.filter(it => it.id !== confirm.itemId))
      onToast('Блюдо удалено', 'error')
    }, 300) // заменить на реальный fetch
    // ─────────────────────────────────────────────────────────────────────────────
    setConfirm(null)
  }

  function setField(key, value) {
    setForm(f => ({ ...f, [key]: value }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: undefined }))
  }

  const colSpan = showWeight ? 5 : 4

  if (loading) return <Spinner text="Загружаем блюда..." />

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
                  {showWeight && <th>Вес/объём</th>}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {catItems.length === 0
                  ? <tr className="empty-row"><td colSpan={colSpan}>Блюд нет — добавьте первое</td></tr>
                  : catItems.map(item => (
                    <tr key={item.id}>
                      <td><strong>{item.name}</strong></td>
                      <td className="text-muted">{item.description}</td>
                      <td>{item.price} ₽</td>
                      {showWeight && <td>{item.weight}</td>}
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

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModal(null)}>×</button>
            <h2>{modal.mode === 'add' ? 'Новое блюдо' : 'Редактировать блюдо'}</h2>

            <div className="form-field">
              <label>Название <span className="required-mark">*</span></label>
              <input
                className={errors.name ? 'input-error' : ''}
                value={form.name}
                onChange={e => setField('name', e.target.value)}
                placeholder="Название блюда"
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="form-field">
              <label>Описание <span className="required-mark">*</span></label>
              <textarea
                className={errors.description ? 'input-error' : ''}
                value={form.description}
                onChange={e => setField('description', e.target.value)}
                placeholder="Краткое описание"
              />
              {errors.description && <span className="field-error">{errors.description}</span>}
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Цена ₽ <span className="required-mark">*</span></label>
                <input
                  type="number"
                  className={errors.price ? 'input-error' : ''}
                  value={form.price}
                  onChange={e => setField('price', e.target.value)}
                  placeholder="0"
                  min="1"
                />
                {errors.price && <span className="field-error">{errors.price}</span>}
              </div>

              {showWeight && (
                <div className="form-field">
                  <label>Вес / объём <span className="required-mark">*</span></label>
                  <input
                    className={errors.weight ? 'input-error' : ''}
                    value={form.weight}
                    onChange={e => setField('weight', e.target.value)}
                    placeholder="150 г"
                  />
                  {errors.weight && <span className="field-error">{errors.weight}</span>}
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setModal(null)}>Отмена</button>
              <button
                className={`btn btn-primary ${saving ? 'btn-loading' : ''}`}
                onClick={handleSave}
              >
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </div>
        </div>
      )}

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
