import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Navbar.css'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const isAdmin = user && (user.username === 'admin123' || user.is_staff)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            🚗 СТО
          </Link>
          <div className="navbar-links">
            <Link to="/services">Услуги</Link>
            <Link to="/parts">Запчасти</Link>
            {user ? (
              <>
                <Link to="/appointments">Мои записи</Link>
                <Link to="/cart">Корзина</Link>
                <Link to="/orders">Заказы</Link>
                <Link to="/consultation">Консультация</Link>
                <Link to="/profile">Профиль</Link>
                {isAdmin && <Link to="/admin">Админ-панель</Link>}
                <button onClick={handleLogout} className="btn btn-secondary">
                  Выход
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Вход</Link>
                <Link to="/register">Регистрация</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

