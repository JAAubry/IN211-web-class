import { useState, useEffect } from 'react'

type User = {
  email: string
} | null

export function useAuth() {
  const [user, setUser] = useState<User>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // -----------------------
  // INIT FROM COOKIE (basic persistence)
  // -----------------------
  useEffect(() => {
    const cookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('authToken='))

    if (cookie) {
      const token = cookie.split('=')[1]

      // fake decode (you can replace with JWT later)
      if (token) {
        setUser({ email: 'user@mock.com' })
        setIsAuthenticated(true)
      }
    }
  }, [])

  // -----------------------
  // LOGIN (optional helper)
  // -----------------------
  function login(email: string) {
    setUser({ email })
    setIsAuthenticated(true)
  }

  // -----------------------
  // LOGOUT (optional)
  // -----------------------
  function logout() {
    document.cookie = 'authToken=; Max-Age=0'
    setUser(null)
    setIsAuthenticated(false)
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
  }
}