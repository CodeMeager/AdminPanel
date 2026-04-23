import React, { useState } from 'react'
import Login from './components/Login'
import Toast from './components/Toast'
import MenuTab from './components/tabs/MenuTab'
import RoomsTab from './components/tabs/RoomsTab'
import RoomPage from './components/tabs/RoomPage'
import BilliardsTab from './components/tabs/BilliardsTab'
import AboutTab from './components/tabs/AboutTab'
import { menuCategories, menuItems, lunchCategories, lunchItems } from './data/mockData'

const TABS = [
  { id: 'menu',    label: 'Меню' },
  { id: 'lunch',   label: 'Бизнес-ланч' },
  { id: 'rooms',   label: 'Номера' },
  { id: 'billiards', label: 'Бильярд' },
  { id: 'about',   label: 'О нас' },
]

let toastIdCounter = 0

export default function App() {
  const [user, setUser]       = useState(null)     // текущий пользователь
  const [activeTab, setActiveTab] = useState('menu')
  const [roomPageData, setRoomPageData] = useState(null) // номер для страницы
  const [toasts, setToasts]   = useState([])

  // ── Toast хелпер ──
  function showToast(message, type = 'success') {
    const id = ++toastIdCounter
    setToasts(prev => [...prev, { id, message, type }])
  }
  function removeToast(id) {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  // ── Авторизация ──
  if (!user) {
    return (
      <>
        <Login onLogin={setUser} />
        <Toast toasts={toasts} onRemove={removeToast} />
      </>
    )
  }

  // ── Страница номера (открывается поверх вкладки «Номера») ──
  if (roomPageData) {
    return (
      <div className="layout">
        <TopBar user={user} onLogout={() => setUser(null)} />
        <div className="tab-content">
          <RoomPage
            room={roomPageData}
            onBack={() => { setActiveTab('rooms'); setRoomPageData(null) }}
            onToast={showToast}
          />
        </div>
        <Toast toasts={toasts} onRemove={removeToast} />
      </div>
    )
  }

  // ── Основной лэйаут ──
  return (
    <div className="layout">
      <TopBar user={user} onLogout={() => setUser(null)} />

      {/* Панель вкладок */}
      <div className="tabs-bar">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Содержимое вкладки */}
      <div className="tab-content">
        {activeTab === 'menu' && (
          <MenuTab categories={menuCategories} initialItems={menuItems} onToast={showToast} />
        )}
        {activeTab === 'lunch' && (
          <MenuTab categories={lunchCategories} initialItems={lunchItems} onToast={showToast} />
        )}
        {activeTab === 'rooms' && (
          <RoomsTab
            onToast={showToast}
            onOpenRoomPage={room => { setRoomPageData(room); setActiveTab('rooms') }}
          />
        )}
        {activeTab === 'billiards' && (
          <BilliardsTab onToast={showToast} />
        )}
        {activeTab === 'about' && (
          <AboutTab onToast={showToast} />
        )}
      </div>

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

// ─── Верхняя панель ────────────────────────────────────────────────────────────
function TopBar({ user, onLogout }) {
  return (
    <div className="topbar">
      <span className="topbar-title">🏨 Админ-панель гостиницы</span>
      <div className="topbar-user">
        <span>{user.name}</span>
        <button onClick={onLogout}>Выйти</button>
      </div>
    </div>
  )
}
