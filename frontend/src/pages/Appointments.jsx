import React, { useState, useEffect } from 'react'
import api from '../services/api'
import './Appointments.css'

function Appointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments/')
      setAppointments(response.data.results || response.data)
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      'pending': '#ffc107',
      'confirmed': '#28a745',
      'cancelled': '#dc3545',
      'done': '#6c757d'
    }
    return colors[status] || '#6c757d'
  }

  const getStatusText = (status) => {
    const texts = {
      'pending': 'Ожидает',
      'confirmed': 'Подтверждена',
      'cancelled': 'Отменена',
      'done': 'Выполнена'
    }
    return texts[status] || status
  }

  if (loading) return <div className="container"><p>Загрузка...</p></div>

  return (
    <div className="container">
      <h1>Мои записи</h1>
      {appointments.length === 0 ? (
        <div className="card">
          <p>У вас пока нет записей. <a href="/services">Записаться на услугу</a></p>
        </div>
      ) : (
        <div className="appointments-list">
          {appointments.map(appointment => (
            <div key={appointment.id} className="card appointment-card">
              <div className="appointment-header">
                <h3>{appointment.service_title}</h3>
                <span 
                  className="status-badge"
                  style={{backgroundColor: getStatusColor(appointment.status)}}
                >
                  {getStatusText(appointment.status)}
                </span>
              </div>
              <div className="appointment-info">
                <p><strong>Дата и время:</strong> {new Date(appointment.appointment_datetime).toLocaleString('ru-RU')}</p>
                {appointment.master_name && (
                  <p><strong>Мастер:</strong> {appointment.master_name}</p>
                )}
                {appointment.notes && (
                  <p><strong>Примечания:</strong> {appointment.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Appointments

