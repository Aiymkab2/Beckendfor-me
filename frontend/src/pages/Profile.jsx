import React, { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import './Profile.css'

function Profile() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    profile: {
      full_name: '',
      phone: '',
      car_info: ''
    }
  })
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/profile/')
      setFormData(response.data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    if (e.target.name.startsWith('profile.')) {
      const field = e.target.name.split('.')[1]
      setFormData({
        ...formData,
        profile: {
          ...formData.profile,
          [field]: e.target.value
        }
      })
    } else {
      setFormData({...formData, [e.target.name]: e.target.value})
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.put('/auth/profile/', formData)
      setMessage('Профиль успешно обновлен!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Ошибка при обновлении профиля')
    }
  }

  if (loading) return <div className="container"><p>Загрузка...</p></div>

  return (
    <div className="container">
      <h1>Мой профиль</h1>
      {message && <div className={`message ${message.includes('успешно') ? 'success' : 'error'}`}>{message}</div>}
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Имя пользователя</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Полное имя</label>
            <input
              type="text"
              name="profile.full_name"
              value={formData.profile?.full_name || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Телефон</label>
            <input
              type="tel"
              name="profile.phone"
              value={formData.profile?.phone || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Информация об автомобиле</label>
            <input
              type="text"
              name="profile.car_info"
              value={formData.profile?.car_info || ''}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Сохранить изменения
          </button>
        </form>
      </div>
    </div>
  )
}

export default Profile

