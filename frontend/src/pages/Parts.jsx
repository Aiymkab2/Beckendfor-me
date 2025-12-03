import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import './Parts.css'

function Parts() {
  const [parts, setParts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchParts()
  }, [search])

  const fetchParts = async () => {
    try {
      const params = {}
      if (search) params.search = search
      const response = await api.get('/parts/', { params })
      setParts(response.data.results || response.data)
    } catch (error) {
      console.error('Error fetching parts:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="container"><p>Загрузка...</p></div>

  return (
    <div className="container">
      <h1>Каталог запчастей</h1>
      
      <div className="filters">
        <input
          type="text"
          placeholder="Поиск запчастей..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="grid">
        {parts.map(part => (
          <div key={part.id} className="card part-card">
            {part.image && (
              <img src={`http://localhost:8000${part.image}`} alt={part.title} />
            )}
            <div className="part-header">
              <h3>{part.title}</h3>
              <span className="sku">SKU: {part.sku}</span>
            </div>
            <p className="description">{part.description}</p>
            {part.supplier && <p className="supplier">Поставщик: {part.supplier}</p>}
            <div className="part-info">
              <span className="price">{part.price_kzt} ₸</span>
              <span className={`stock ${part.stock_quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {part.stock_quantity > 0 ? `В наличии: ${part.stock_quantity}` : 'Нет в наличии'}
              </span>
            </div>
            <Link to={`/parts/${part.id}`} className="btn btn-primary">
              Подробнее
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Parts

