import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import './AdminComponents.css'

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await api.get('/admin/parts/orders/')
      setOrders(response.data.results || response.data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/orders/${id}/`, { status })
      fetchOrders()
    } catch (error) {
      alert('Ошибка при обновлении статуса')
    }
  }

  if (loading) return <p>Загрузка...</p>

  return (
    <div>
      <h2>Все заказы запчастей</h2>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Клиент</th>
              <th>Товары</th>
              <th>Сумма</th>
              <th>Статус</th>
              <th>Дата</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user_username}</td>
                <td>
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="order-item-info">
                      {item.part_title} x{item.quantity}
                    </div>
                  ))}
                </td>
                <td>{order.total_kzt} ₸</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="pending">Ожидает</option>
                    <option value="processing">В обработке</option>
                    <option value="shipped">Отправлен</option>
                    <option value="delivered">Доставлен</option>
                    <option value="cancelled">Отменен</option>
                  </select>
                </td>
                <td>{new Date(order.created_at).toLocaleString('ru-RU')}</td>
                <td>-</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminOrders

