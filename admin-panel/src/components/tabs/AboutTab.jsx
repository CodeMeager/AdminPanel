import React, { useState } from 'react'
import ConfirmModal from '../ConfirmModal'
import { documents as initialDocs } from '../../data/mockData'

export default function AboutTab({ onToast }) {
  const [docs, setDocs] = useState(initialDocs)
  const [modal, setModal] = useState(false)
  const [confirm, setConfirm] = useState(null)
  const [form, setForm] = useState({ name: '', filename: '' })

  function handleAdd() {
    if (!form.name.trim()) return
    setDocs(prev => [...prev, { id: Date.now(), name: form.name.trim(), filename: form.filename || 'файл.pdf' }])
    setModal(false)
    setForm({ name: '', filename: '' })
    onToast('Документ добавлен')
  }

  function handleDelete() {
    setDocs(prev => prev.filter(d => d.id !== confirm.docId))
    setConfirm(null)
    onToast('Документ удалён', 'error')
  }

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (file) setForm(f => ({ ...f, filename: file.name }))
  }

  return (
    <div>
      <div className="section-header">
        <h2>Документы</h2>
        <button className="btn btn-primary" onClick={() => { setForm({ name: '', filename: '' }); setModal(true) }}>
          + Добавить документ
        </button>
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
              <label>Название *</label>
              <input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Напр: Правила проживания"
                autoFocus
              />
            </div>
            <div className="form-field">
              <label>Файл</label>
              <label className="photo-upload-label" style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                <span>📎</span>
                <span>{form.filename || 'Выбрать файл...'}</span>
                <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" onChange={handleFileChange} />
              </label>
            </div>

            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setModal(false)}>Отмена</button>
              <button className="btn btn-primary" onClick={handleAdd}>Добавить</button>
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
