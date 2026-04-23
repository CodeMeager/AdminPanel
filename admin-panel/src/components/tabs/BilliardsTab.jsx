import React, { useState } from 'react'
import { billiardPrices } from '../../data/mockData'

export default function BilliardsTab({ onToast }) {
  const [prices, setPrices] = useState(billiardPrices)
  // editing: id ячейки, которую сейчас редактируют
  const [editing, setEditing] = useState(null)
  const [draft, setDraft] = useState('')

  const tables = ['12 футов', '8 футов']

  function startEdit(row) {
    setEditing(row.id)
    setDraft(String(row.price))
  }

  function saveEdit(id) {
    const val = parseInt(draft, 10)
    if (!isNaN(val) && val >= 0) {
      setPrices(prev => prev.map(p => p.id === id ? { ...p, price: val } : p))
      onToast('Цена обновлена')
    }
    setEditing(null)
  }

  function handleKeyDown(e, id) {
    if (e.key === 'Enter') saveEdit(id)
    if (e.key === 'Escape') setEditing(null)
  }

  return (
    <div>
      <div className="section-header">
        <h2>Бильярд — цены</h2>
      </div>
      <p className="text-muted" style={{ marginBottom: 20 }}>
        Нажмите на цену, чтобы изменить. Нажмите Enter или кликните в другое место для сохранения.
      </p>

      <div className="billiard-tables">
        {tables.map(table => (
          <div key={table} className="billiard-table-block">
            <h3>{table}</h3>
            <table className="billiard-table">
              <thead>
                <tr>
                  <th>Время</th>
                  <th>Цена ₽</th>
                </tr>
              </thead>
              <tbody>
                {prices.filter(p => p.table === table).map(row => (
                  <tr key={row.id}>
                    <td>{row.duration}</td>
                    <td>
                      {editing === row.id
                        ? (
                          <div className="price-cell">
                            <input
                              className="price-input"
                              type="number"
                              value={draft}
                              onChange={e => setDraft(e.target.value)}
                              onBlur={() => saveEdit(row.id)}
                              onKeyDown={e => handleKeyDown(e, row.id)}
                              autoFocus
                              min="0"
                            />
                            <span className="text-muted" style={{ fontSize: 13 }}>₽</span>
                          </div>
                        )
                        : (
                          <div
                            className="price-cell"
                            style={{ cursor: 'pointer' }}
                            onClick={() => startEdit(row)}
                            title="Нажмите для редактирования"
                          >
                            <strong>{row.price.toLocaleString('ru')} ₽</strong>
                            <span style={{ fontSize: 14, color: 'var(--muted)' }}>✏️</span>
                          </div>
                        )
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  )
}
