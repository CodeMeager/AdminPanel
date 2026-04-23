import React from 'react'

// Универсальный индикатор загрузки
export default function Spinner({ text = 'Загрузка...' }) {
  return (
    <div className="spinner-wrap">
      <div className="spinner" />
      <span className="spinner-text">{text}</span>
    </div>
  )
}
