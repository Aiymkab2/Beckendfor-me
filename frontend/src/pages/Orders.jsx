import React, { useState, useEffect } from 'react'
import api from '../services/api'
import './Orders.css'

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/')
      setOrders(response.data.results || response.data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      'pending': '#ffc107',
      'processing': '#17a2b8',
      'shipped': '#007bff',
      'delivered': '#28a745',
      'cancelled': '#dc3545'
    }
    return colors[status] || '#6c757d'
  }

  const getStatusText = (status) => {
    const texts = {
      'pending': 'Ожидает',
      'processing': 'В обработке',
      'shipped': 'Отправлен',
      'delivered': 'Доставлен',
      'cancelled': 'Отменен'
    }
    return texts[status] || status
  }

  if (loading) return <div className="container"><p>Загрузка...</p></div>

  return (
    <div className="container">
      <h1>Мои заказы</h1>
      {orders.length === 0 ? (
        <div className="card">
          <p>У вас пока нет заказов. <a href="/parts">Перейти к каталогу запчастей</a></p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="card order-card">
              <div className="order-header">
                <h3>Заказ #{order.id}</h3>
                <span 
                  className="status-badge"
                  style={{backgroundColor: getStatusColor(order.status)}}
                >
                  {getStatusText(order.status)}
                </span>
              </div>
              <p className="order-date">
                Дата: {new Date(order.created_at).toLocaleString('ru-RU')}
              </p>
              <div className="order-items">
                <h4>Товары:</h4>
                {order.items?.map((item, index) => (
                  <div key={index} className="order-item">
                    <span>{item.part_title} (SKU: {item.part_sku})</span>
                    <span>x{item.quantity}</span>
                    <span>{item.price_at_order} ₸</span>
                  </div>
                ))}
              </div>
              <div className="order-total">
                <strong>Итого: {order.total_kzt} ₸</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders

