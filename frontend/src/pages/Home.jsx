import React from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <h1>Добро пожаловать в СТО</h1>
          <p>Профессиональный автосервис с современным оборудованием</p>
          <div className="hero-buttons">
            <Link to="/services" className="btn btn-primary">Наши услуги</Link>
            <Link to="/parts" className="btn btn-secondary">Каталог запчастей</Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Почему выбирают нас?</h2>
          <div className="grid">
            <div className="card feature-card">
              <div className="feature-icon">🔧</div>
              <h3>Профессионализм</h3>
              <p>Опытные мастера с многолетним стажем и сертификатами</p>
            </div>
            <div className="card feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Быстро</h3>
              <p>Выполняем работы в кратчайшие сроки без потери качества</p>
            </div>
            <div className="card feature-card">
              <div className="feature-icon">💰</div>
              <h3>Доступные цены</h3>
              <p>Честные цены без переплат и скрытых платежей</p>
            </div>
            <div className="card feature-card">
              <div className="feature-icon">🛠️</div>
              <h3>Оригинальные запчасти</h3>
              <p>Только проверенные поставщики с гарантией качества</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

