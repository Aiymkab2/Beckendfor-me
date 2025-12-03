import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      // Try to get user info - use a simple user object from token if profile fails
      api.get('/auth/profile/')
        .then(response => {
          setUser(response.data)
        })
        .catch(() => {
          // If profile fetch fails, try to decode token or just clear
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login/', { username, password })
      const { access, refresh, user: userData } = response.data
      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`
      setUser(userData)
      return { success: true, isAdmin: response.data.is_admin }
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Ошибка входа' }
    }
  }

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register/', userData)
      const { access, refresh, user: newUser } = response.data
      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`
      setUser(newUser)
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.password?.[0] || 
                           error.response?.data?.username?.[0] ||
                           error.response?.data?.email?.[0] ||
                           (typeof error.response?.data === 'string' ? error.response.data : 'Ошибка регистрации')
      return { success: false, error: errorMessage }
    }
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

