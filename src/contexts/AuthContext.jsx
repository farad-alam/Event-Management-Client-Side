import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on app start
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      // Fetch users from JSON file
      const response = await fetch('/data/users.json')
      const users = await response.json()
      
      const foundUser = users.find(u => u.email === email)
      
      if (foundUser) {
        // In a real app, you would verify the password here
        setUser(foundUser)
        localStorage.setItem('user', JSON.stringify(foundUser))
        return { success: true }
      } else {
        return { success: false, error: 'Invalid email or password' }
      }
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' }
    }
  }

  const register = async (userData) => {
    try {
      // Fetch existing users
      const response = await fetch('/data/users.json')
      const users = await response.json()
      
      // Check if email already exists
      const existingUser = users.find(u => u.email === userData.email)
      if (existingUser) {
        return { success: false, error: 'Email already exists' }
      }

      // Create new user with new ID
      const newUser = {
        id: Math.max(...users.map(u => u.id)) + 1,
        ...userData
      }

      // In a real app, you would save this to the backend
      // For now, we'll just store it in localStorage and set as current user
      setUser(newUser)
      localStorage.setItem('user', JSON.stringify(newUser))
      
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Registration failed. Please try again.' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}