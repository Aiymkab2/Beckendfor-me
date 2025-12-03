import React, { useState, useEffect } from 'react'
import api from '../services/api'
import './Consultation.css'

function Consultation() {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const response = await api.get('/consultation/')
      setMessages(response.data.results || response.data)
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setLoading(true)
    try {
      await api.post('/consultation/', { message: newMessage })
      setNewMessage('')
      fetchMessages()
    } catch (error) {
      alert('Ошибка при отправке сообщения')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>Онлайн-консультация</h1>
      
      <div className="consultation-content">
        <div className="messages-list card">
          <h2>История сообщений</h2>
          {messages.length === 0 ? (
            <p>Пока нет сообщений</p>
          ) : (
            <div className="messages">
              {messages.map(message => (
                <div key={message.id} className="message-item">
                  <div className="message-header">
                    <span className="message-date">
                      {new Date(message.created_at).toLocaleString('ru-RU')}
                    </span>
                    <span className={`status ${message.status}`}>
                      {message.status === 'new' ? 'Новое' : 
                       message.status === 'answered' ? 'Отвечено' : 'Закрыто'}
                    </span>
                  </div>
                  <div className="message-content">
                    <p><strong>Ваш вопрос:</strong></p>
                    <p>{message.message}</p>
                    {message.reply && (
                      <>
                        <p className="reply"><strong>Ответ:</strong></p>
                        <p>{message.reply}</p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="new-message card">
          <h2>Задать вопрос</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Ваш вопрос</label>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                rows="6"
                placeholder="Опишите ваш вопрос или проблему..."
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? 'Отправка...' : 'Отправить'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Consultation

