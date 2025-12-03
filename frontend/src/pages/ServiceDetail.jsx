import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import './ServiceDetail.css'

function ServiceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [service, setService] = useState(null)
  const [masters, setMasters] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    master: '',
    appointment_datetime: '',
    notes: ''
  })

  useEffect(() => {
    fetchService()
    fetchMasters()
  }, [id])

  const fetchService = async () => {
    try {
      const response = await api.get(`/services/${id}/`)
      setService(response.data)
    } catch (error) {
      console.error('Error fetching service:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMasters = async () => {
    try {
      const response = await api.get('/masters/')
      setMasters(response.data)
    } catch (error) {
      console.error('Error fetching masters:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }

    try {
      await api.post('/appointments/', {
        service: service.id,
        master: formData.master || null,
        appointment_datetime: formData.appointment_datetime,
        notes: formData.notes
      })
      alert('Запись успешно создана!')
      navigate('/appointments')
    } catch (error) {
      alert('Ошибка при создании записи: ' + (error.response?.data?.detail || error.message))
    }
  }

  if (loading) return <div className="container"><p>Загрузка...</p></div>
  if (!service) return <div className="container"><p>Услуга не найдена</p></div>

  return (
    <div className="container">
      <Link to="/services" className="back-link">← Назад к услугам</Link>
      
      <div className="service-detail">
        <div className="service-detail-main">
          {service.image && (
            <img src={`http://localhost:8000${service.image}`} alt={service.title} />
          )}
          <div>
            <h1>{service.title}</h1>
            <p className="category">{service.category}</p>
            <p className="description">{service.description}</p>
            <div className="service-info">
              <div className="price-badge">{service.price_kzt} ₸</div>
              <div className="duration-badge">⏱ {service.duration_minutes} минут</div>
            </div>
          </div>
        </div>

        {user && (
          <div className="booking-form card">
            <h2>Записаться на услугу</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Мастер (опционально)</label>
                <select
                  value={formData.master}
                  onChange={(e) => setFormData({...formData, master: e.target.value})}
                >
                  <option value="">Выберите мастера</option>
                  {masters.map(master => (
                    <option key={master.id} value={master.id}>
                      {master.name} - {master.specialization}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Дата и время</label>
                <input
                  type="datetime-local"
                  value={formData.appointment_datetime}
                  onChange={(e) => setFormData({...formData, appointment_datetime: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Примечания</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows="4"
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Записаться
              </button>
            </form>
          </div>
        )}

        {!user && (
          <div className="card">
            <p>Для записи на услугу необходимо <Link to="/login">войти</Link> или <Link to="/register">зарегистрироваться</Link></p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ServiceDetail

