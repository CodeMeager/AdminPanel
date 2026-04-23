import React, { useEffect } from 'react'

// Один toast исчезает через 3 секунды
function ToastItem({ toast, onRemove }) {
  useEffect(() => {
    const t = setTimeout(() => onRemove(toast.id), 3000)
    return () => clearTimeout(t)
  }, [toast.id, onRemove])

  return <div className={`toast ${toast.type || 'success'}`}>{toast.message}</div>
}

export default function Toast({ toasts, onRemove }) {
  if (!toasts.length) return null
  return (
    <div className="toast-container">
      {toasts.map(t => <ToastItem key={t.id} toast={t} onRemove={onRemove} />)}
    </div>
  )
}
