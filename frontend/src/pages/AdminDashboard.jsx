import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import AdminAppointments from '../components/admin/AdminAppointments'
import AdminOrders from '../components/admin/AdminOrders'
import AdminServices from '../components/admin/AdminServices'
import AdminParts from '../components/admin/AdminParts'
import './AdminDashboard.css'

function AdminDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('appointments')

  if (!user || (user.username !== 'admin123' && !user.is_staff)) {
    return (
      <div className="container">
        <div className="card">
          <p>Доступ запрещен</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <h1>Админ-панель</h1>
      <div className="admin-dashboard">
        <div className="admin-tabs">
          <button 
            className={activeTab === 'appointments' ? 'active' : ''}
            onClick={() => setActiveTab('appointments')}
          >
            Записи
          </button>
          <button 
            className={activeTab === 'orders' ? 'active' : ''}
            onClick={() => setActiveTab('orders')}
          >
            Заказы
          </button>
          <button 
            className={activeTab === 'services' ? 'active' : ''}
            onClick={() => setActiveTab('services')}
          >
            Услуги
          </button>
          <button 
            className={activeTab === 'parts' ? 'active' : ''}
            onClick={() => setActiveTab('parts')}
          >
            Запчасти
          </button>
        </div>

        <div className="admin-content">
          {activeTab === 'appointments' && <AdminAppointments />}
          {activeTab === 'orders' && <AdminOrders />}
          {activeTab === 'services' && <AdminServices />}
          {activeTab === 'parts' && <AdminParts />}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

