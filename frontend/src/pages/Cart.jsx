import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import './Cart.css'

function Cart() {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCart(savedCart)
  }, [])

  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index)
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const updateQuantity = (index, quantity) => {
    const newCart = [...cart]
    newCart[index].quantity = Math.max(1, quantity)
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + (parseFloat(item.price_kzt) * item.quantity), 0)
  }

  const handleCheckout = async () => {
    if (cart.length === 0) return

    setLoading(true)
    try {
      const items = cart.map(item => ({
        part_id: item.part_id,
        quantity: item.quantity
      }))
      
      await api.post('/orders/create/', { items })
      localStorage.removeItem('cart')
      setCart([])
      alert('Заказ успешно создан!')
      navigate('/orders')
    } catch (error) {
      alert('Ошибка при создании заказа: ' + (error.response?.data?.error || error.message))
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="container">
        <h1>Корзина</h1>
        <div className="card">
          <p>Корзина пуста. <a href="/parts">Перейти к каталогу запчастей</a></p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <h1>Корзина</h1>
      <div className="cart-content">
        <div className="cart-items">
          {cart.map((item, index) => (
            <div key={index} className="card cart-item">
              <div className="cart-item-info">
                <h3>{item.title}</h3>
                <p className="price">{item.price_kzt} ₸</p>
              </div>
              <div className="cart-item-controls">
                <label>Количество:</label>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(index, parseInt(e.target.value) || 1)}
                  className="quantity-input"
                />
                <button 
                  onClick={() => removeFromCart(index)}
                  className="btn btn-danger"
                >
                  Удалить
                </button>
              </div>
              <div className="cart-item-total">
                Итого: {(parseFloat(item.price_kzt) * item.quantity).toFixed(2)} ₸
              </div>
            </div>
          ))}
        </div>
        <div className="cart-summary card">
          <h2>Итого</h2>
          <div className="summary-total">
            <strong>{getTotal().toFixed(2)} ₸</strong>
          </div>
          <button 
            onClick={handleCheckout}
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Оформление...' : 'Оформить заказ'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cart

