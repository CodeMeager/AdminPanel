import React, { useState, useEffect } from 'react'
import ConfirmModal from '../ConfirmModal'
import Spinner from '../Spinner'
import { documents as initialDocs } from '../../data/mockData'

export default function AboutTab({ onToast }) {
  // ─── LOADING_STATE: заменить на fetch('/admin/api.php?action=get_documents') ───
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [docs, setDocs] = useState([])

  useEffect(() => {
    const t = setTimeout(() => {
      setDocs(initialDocs)
      setLoading(false)
    }, 500) // заменить на реальный fetch
    return () => clearTimeout(t)
  }, [])
  // ──────────────────────────────────────────────────────────────────────────

  const [modal, setModal] = useState(false)
  const [confirm, setConfirm] = useState(null)
  const [form, setForm] = useState({ name: '', filename: '' })
  const [errors, setErrors] = useState({})

  function setField(key, value) {
    setForm(f => ({ ...f, [key]: value }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: undefined }))
  }

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (file) setField('filename', file.name)
  }

  function validate() {
    const e = {}
    if (!form.name.trim())     e.name     = 'Введите название документа'
    if (!form.filename.trim()) e.filename = 'Выберите файл'
    return e
  }

  function handleAdd() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }

    // ─── LOADING_STATE: заменить на fetch('/admin/api.php?action=upload_document') ───
    setSaving(true)
    setTimeout(() => {
      setDocs(prev => [...prev, { id: Date.now(), name: form.name.trim(), filename: form.filename }])
      setModal(false)
      setForm({ name: '', filename: '' })
      setErrors({})
      onToast('Документ добавлен')
      setSaving(false)
    }, 400) // заменить на реальный fetch
    // ──────────────────────────────────────────────────────────────────────────
  }

  function handleDelete() {
    // ─── LOADING_STATE: заменить на fetch('/admin/api.php?action=delete_document') ───
    setTimeout(() => {
      setDocs(prev => prev.filter(d => d.id !== confirm.docId))
      onToast('Документ удалён', 'error')
    }, 300) // заменить на реальный fetch
    // ──────────────────────────────────────────────────────────────────────────
    setConfirm(null)
  }

  function openModal() {
    setForm({ name: '', filename: '' })
    setErrors({})
    setModal(true)
  }

  if (loading) return <Spinner text="Загружаем документы..." />

  return (
    <div>
      <div className="section-header">
        <h2>Документы</h2>
        <button className="btn btn-primary" onClick={openModal}>+ Добавить документ</button>
      </div>

      <div className="documents-list">
        {docs.length === 0 && <p className="text-muted">Документов нет</p>}
        {docs.map(doc => (
          <div key={doc.id} className="document-item">
            <div className="document-item-info">
              <span className="doc-icon">📄</span>
              <div>
                <div className="doc-name">{doc.name}</div>
                <div className="doc-file">{doc.filename}</div>
              </div>
            </div>
            <button className="btn btn-icon" title="Удалить" onClick={() => setConfirm({ docId: doc.id })}>🗑️</button>
          </div>
        ))}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal modal-sm" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModal(false)}>×</button>
            <h2>Новый документ</h2>

            <div className="form-field">
              <label>Название <span className="required-mark">*</span></label>
              <input
                className={errors.name ? 'input-error' : ''}
                value={form.name}
                onChange={e => setField('name', e.target.value)}
                placeholder="Напр: Правила проживания"
                autoFocus
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="form-field">
              <label>Файл <span className="required-mark">*</span></label>
              <label className={`photo-upload-label ${errors.filename ? 'input-error' : ''}`} style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                <span>📎</span>
                <span>{form.filename || 'Выбрать файл...'}</span>
                <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" onChange={handleFileChange} />
              </label>
              {errors.filename && <span className="field-error">{errors.filename}</span>}
            </div>

            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setModal(false)}>Отмена</button>
              <button
                className={`btn btn-primary ${saving ? 'btn-loading' : ''}`}
                onClick={handleAdd}
              >
                {saving ? 'Добавление...' : 'Добавить'}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirm && (
        <ConfirmModal
          message="Вы уверены, что хотите удалить этот документ?"
          onConfirm={handleDelete}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  )
}
