import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import './AdminComponents.css'

function AdminAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/admin/appointments/')
      setAppointments(response.data.results || response.data)
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/appointments/${id}/`, { status })
      fetchAppointments()
    } catch (error) {
      alert('Ошибка при обновлении статуса')
    }
  }

  if (loading) return <p>Загрузка...</p>

  return (
    <div>
      <h2>Все записи</h2>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Клиент</th>
              <th>Услуга</th>
              <th>Мастер</th>
              <th>Дата и время</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(appointment => (
              <tr key={appointment.id}>
                <td>{appointment.id}</td>
                <td>{appointment.user_username}</td>
                <td>{appointment.service_title}</td>
                <td>{appointment.master_name || '-'}</td>
                <td>{new Date(appointment.appointment_datetime).toLocaleString('ru-RU')}</td>
                <td>
                  <select
                    value={appointment.status}
                    onChange={(e) => updateStatus(appointment.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="pending">Ожидает</option>
                    <option value="confirmed">Подтверждена</option>
                    <option value="cancelled">Отменена</option>
                    <option value="done">Выполнена</option>
                  </select>
                </td>
                <td>
                  {appointment.notes && (
                    <span title={appointment.notes}>📝</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminAppointments

