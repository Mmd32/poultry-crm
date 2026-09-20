import { createContext, useContext } from 'react'

const AuthContext = createContext(null)

const DEMO_USER = {
  username: 'admin',
  first_name: 'مدیر',
  last_name: 'سیستم',
  role: 'admin',
}

export function AuthProvider({ children }) {
  const value = {
    user: DEMO_USER,
    loading: false,
    login: async () => DEMO_USER,
    logout: () => {},
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
