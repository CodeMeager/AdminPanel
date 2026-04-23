import React, { useState } from 'react'
import { users } from '../data/mockData'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const user = users.find(u => u.username === username && u.password === password)
    if (user) {
      onLogin(user)
    } else {
      setError('Неверный логин или пароль')
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <h1>🏨 Гостиница</h1>
        <p className="subtitle">Вход в панель управления</p>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Логин</label>
            <input
              type="text"
              value={username}
              onChange={e => { setUsername(e.target.value); setError('') }}
              placeholder="Введите логин"
              autoFocus
            />
          </div>
          <div className="field">
            <label>Пароль</label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              placeholder="Введите пароль"
            />
          </div>
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="btn btn-primary">Войти</button>
        </form>
      </div>
    </div>
  )
}
