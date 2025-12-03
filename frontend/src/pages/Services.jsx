import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import './Services.css'

function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    fetchServices()
  }, [search, category])

  const fetchServices = async () => {
    try {
      const params = {}
      if (search) params.search = search
      if (category) params.category = category
      const response = await api.get('/services/', { params })
      setServices(response.data.results || response.data)
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [...new Set(services.map(s => s.category))]

  if (loading) return <div className="container"><p>Загрузка...</p></div>

  return (
    <div className="container">
      <h1>Каталог услуг</h1>
      
      <div className="filters">
        <input
          type="text"
          placeholder="Поиск услуг..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="category-select"
        >
          <option value="">Все категории</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="grid">
        {services.map(service => (
          <div key={service.id} className="card service-card">
            {service.image && (
              <img src={`http://localhost:8000${service.image}`} alt={service.title} />
            )}
            <h3>{service.title}</h3>
            <p className="category">{service.category}</p>
            <p className="description">{service.description}</p>
            <div className="service-info">
              <span className="price">{service.price_kzt} ₸</span>
              <span className="duration">⏱ {service.duration_minutes} мин</span>
            </div>
            <Link to={`/services/${service.id}`} className="btn btn-primary">
              Подробнее
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Services

