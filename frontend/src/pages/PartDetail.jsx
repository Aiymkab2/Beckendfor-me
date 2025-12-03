import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import './PartDetail.css'

function PartDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [part, setPart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    fetchPart()
  }, [id])

  const fetchPart = async () => {
    try {
      const response = await api.get(`/parts/${id}/`)
      setPart(response.data)
    } catch (error) {
      console.error('Error fetching part:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    try {
      const response = await api.post('/cart/add/', {
        part_id: part.id,
        quantity: quantity
      })
      
      // Add to local cart
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      cart.push({
        part_id: part.id,
        title: part.title,
        price_kzt: part.price_kzt,
        quantity: quantity
      })
      localStorage.setItem('cart', JSON.stringify(cart))
      
      alert('Товар добавлен в корзину!')
    } catch (error) {
      alert('Ошибка: ' + (error.response?.data?.error || error.message))
    }
  }

  if (loading) return <div className="container"><p>Загрузка...</p></div>
  if (!part) return <div className="container"><p>Запчасть не найдена</p></div>

  return (
    <div className="container">
      <Link to="/parts" className="back-link">← Назад к запчастям</Link>
      
      <div className="part-detail">
        <div className="part-detail-main">
          {part.image && (
            <img src={`http://localhost:8000${part.image}`} alt={part.title} />
          )}
          <div>
            <h1>{part.title}</h1>
            <p className="sku">SKU: {part.sku}</p>
            <p className="description">{part.description}</p>
            {part.supplier && <p className="supplier">Поставщик: {part.supplier}</p>}
            <div className="part-info">
              <div className="price-badge">{part.price_kzt} ₸</div>
              <div className={`stock-badge ${part.stock_quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {part.stock_quantity > 0 ? `В наличии: ${part.stock_quantity}` : 'Нет в наличии'}
              </div>
            </div>

            {user && part.stock_quantity > 0 && (
              <div className="add-to-cart">
                <label>Количество:</label>
                <input
                  type="number"
                  min="1"
                  max={part.stock_quantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(part.stock_quantity, parseInt(e.target.value) || 1)))}
                  className="quantity-input"
                />
                <button onClick={handleAddToCart} className="btn btn-primary">
                  Добавить в корзину
                </button>
              </div>
            )}

            {!user && (
              <p>Для заказа необходимо <Link to="/login">войти</Link> или <Link to="/register">зарегистрироваться</Link></p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PartDetail

