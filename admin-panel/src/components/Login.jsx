import React, { useState } from 'react'
import { users } from '../data/mockData'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  function handleSubmit(e) {
    e.preventDefault()

    const e_ = {}
    if (!username.trim()) e_.username = 'Введите логин'
    if (!password.trim()) e_.password = 'Введите пароль'
    if (Object.keys(e_).length) { setErrors(e_); return }

    const user = users.find(u => u.username === username && u.password === password)
    if (user) {
      onLogin(user)
    } else {
      setErrors({ auth: 'Неверный логин или пароль' })
    }
  }

  function setField(key, value) {
    if (key === 'username') setUsername(value)
    if (key === 'password') setPassword(value)
    setErrors(e => ({ ...e, [key]: undefined, auth: undefined }))
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <h1>🏨 Гостиница</h1>
        <p className="subtitle">Вход в панель управления</p>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Логин <span className="required-mark">*</span></label>
            <input
              type="text"
              value={username}
              className={errors.username ? 'input-error' : ''}
              onChange={e => setField('username', e.target.value)}
              placeholder="Введите логин"
              autoFocus
            />
            {errors.username && <span className="field-error">{errors.username}</span>}
          </div>
          <div className="field">
            <label>Пароль <span className="required-mark">*</span></label>
            <input
              type="password"
              value={password}
              className={errors.password ? 'input-error' : ''}
              onChange={e => setField('password', e.target.value)}
              placeholder="Введите пароль"
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>
          {errors.auth && <div className="login-error">{errors.auth}</div>}
          <button type="submit" className="btn btn-primary">Войти</button>
        </form>
      </div>
    </div>
  )
}
