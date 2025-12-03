import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import './AdminComponents.css'

function AdminParts() {
  const [parts, setParts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price_kzt: '',
    stock_quantity: '',
    supplier: '',
    active: true
  })

  useEffect(() => {
    fetchParts()
  }, [])

  const fetchParts = async () => {
    try {
      const response = await api.get('/admin/parts/')
      setParts(response.data.results || response.data)
    } catch (error) {
      console.error('Error fetching parts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (part) => {
    setEditing(part.id)
    setFormData({
      title: part.title,
      description: part.description,
      price_kzt: part.price_kzt,
      stock_quantity: part.stock_quantity,
      supplier: part.supplier || '',
      active: part.active
    })
  }

  const handleSave = async (id) => {
    try {
      await api.put(`/admin/parts/${id}/`, formData)
      setEditing(null)
      fetchParts()
    } catch (error) {
      alert('Ошибка при сохранении')
    }
  }

  const handleUpdateStock = async (id, stockQuantity) => {
    try {
      await api.patch(`/admin/parts/${id}/update-stock/`, { stock_quantity: stockQuantity })
      fetchParts()
    } catch (error) {
      alert('Ошибка при обновлении запасов')
    }
  }

  const handleCancel = () => {
    setEditing(null)
  }

  if (loading) return <p>Загрузка...</p>

  return (
    <div>
      <h2>Управление запчастями</h2>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>SKU</th>
              <th>Название</th>
              <th>Цена (₸)</th>
              <th>Запасы</th>
              <th>Поставщик</th>
              <th>Активна</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {parts.map(part => (
              <tr key={part.id}>
                <td>{part.id}</td>
                <td>{part.sku}</td>
                <td>
                  {editing === part.id ? (
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="admin-input"
                    />
                  ) : (
                    part.title
                  )}
                </td>
                <td>
                  {editing === part.id ? (
                    <input
                      type="number"
                      value={formData.price_kzt}
                      onChange={(e) => setFormData({...formData, price_kzt: e.target.value})}
                      className="admin-input"
                    />
                  ) : (
                    part.price_kzt
                  )}
                </td>
                <td>
                  {editing === part.id ? (
                    <input
                      type="number"
                      value={formData.stock_quantity}
                      onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
                      className="admin-input"
                    />
                  ) : (
                    <div className="stock-control">
                      <span>{part.stock_quantity}</span>
                      <input
                        type="number"
                        placeholder="Новое кол-во"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleUpdateStock(part.id, parseInt(e.target.value))
                            e.target.value = ''
                          }
                        }}
                        className="stock-input"
                      />
                    </div>
                  )}
                </td>
                <td>
                  {editing === part.id ? (
                    <input
                      type="text"
                      value={formData.supplier}
                      onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                      className="admin-input"
                    />
                  ) : (
                    part.supplier || '-'
                  )}
                </td>
                <td>
                  {editing === part.id ? (
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({...formData, active: e.target.checked})}
                    />
                  ) : (
                    part.active ? 'Да' : 'Нет'
                  )}
                </td>
                <td>
                  {editing === part.id ? (
                    <div className="admin-actions">
                      <button onClick={() => handleSave(part.id)} className="btn btn-success btn-sm">
                        Сохранить
                      </button>
                      <button onClick={handleCancel} className="btn btn-secondary btn-sm">
                        Отмена
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => handleEdit(part)} className="btn btn-primary btn-sm">
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

export default AdminParts

