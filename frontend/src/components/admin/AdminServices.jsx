import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import './AdminComponents.css'

function AdminServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration_minutes: '',
    price_kzt: '',
    category: '',
    active: true
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await api.get('/admin/services/')
      setServices(response.data.results || response.data)
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (service) => {
    setEditing(service.id)
    setFormData({
      title: service.title,
      description: service.description,
      duration_minutes: service.duration_minutes,
      price_kzt: service.price_kzt,
      category: service.category,
      active: service.active
    })
  }

  const handleSave = async (id) => {
    try {
      await api.put(`/admin/services/${id}/`, formData)
      setEditing(null)
      fetchServices()
    } catch (error) {
      alert('Ошибка при сохранении')
    }
  }

  const handleCancel = () => {
    setEditing(null)
  }

  if (loading) return <p>Загрузка...</p>

  return (
    <div>
      <h2>Управление услугами</h2>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Категория</th>
              <th>Цена (₸)</th>
              <th>Длительность</th>
              <th>Активна</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <tr key={service.id}>
                <td>{service.id}</td>
                <td>
                  {editing === service.id ? (
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="admin-input"
                    />
                  ) : (
                    service.title
                  )}
                </td>
                <td>
                  {editing === service.id ? (
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="admin-input"
                    />
                  ) : (
                    service.category
                  )}
                </td>
                <td>
                  {editing === service.id ? (
                    <input
                      type="number"
                      value={formData.price_kzt}
                      onChange={(e) => setFormData({...formData, price_kzt: e.target.value})}
                      className="admin-input"
                    />
                  ) : (
                    service.price_kzt
                  )}
                </td>
                <td>
                  {editing === service.id ? (
                    <input
                      type="number"
                      value={formData.duration_minutes}
                      onChange={(e) => setFormData({...formData, duration_minutes: e.target.value})}
                      className="admin-input"
                    />
                  ) : (
                    service.duration_minutes
                  )}
                </td>
                <td>
                  {editing === service.id ? (
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({...formData, active: e.target.checked})}
                    />
                  ) : (
                    service.active ? 'Да' : 'Нет'
                  )}
                </td>
                <td>
                  {editing === service.id ? (
                    <div className="admin-actions">
                      <button onClick={() => handleSave(service.id)} className="btn btn-success btn-sm">
                        Сохранить
                      </button>
                      <button onClick={handleCancel} className="btn btn-secondary btn-sm">
                        Отмена
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => handleEdit(service)} className="btn btn-primary btn-sm">
                      Редактировать
                    </button>
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

export default AdminServices

