import React from 'react'

// Универсальный диалог подтверждения перед удалением
export default function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal modal-sm" onClick={e => e.stopPropagation()}>
        <h2>Подтверждение</h2>
        <p className="confirm-text">{message}</p>
        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onCancel}>Отмена</button>
          <button className="btn btn-danger" onClick={onConfirm}>Удалить</button>
        </div>
      </div>
    </div>
  )
}
