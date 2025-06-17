"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { hasAuthority, isTokenExpired } from "@/lib/jwt-utils"

interface AuthContextType {
  token: string | null
  userName: string | null
  isAdmin: boolean
  login: (token: string, userName: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Load token from localStorage on mount
    const savedToken = localStorage.getItem("auth_token")
    const savedUserName = localStorage.getItem("user_name")
    if (savedToken && savedUserName) {
      // Check if token is expired
      if (!isTokenExpired(savedToken)) {
        setToken(savedToken)
        setUserName(savedUserName)
        setIsAdmin(hasAuthority(savedToken, "ADMIN"))
      } else {
        // Token expired, clear storage
        localStorage.removeItem("auth_token")
        localStorage.removeItem("user_name")
      }
    }
  }, [])

  const login = (newToken: string, newUserName: string) => {
    setToken(newToken)
    setUserName(newUserName)
    setIsAdmin(hasAuthority(newToken, "ADMIN"))
    localStorage.setItem("auth_token", newToken)
    localStorage.setItem("user_name", newUserName)
  }

  const logout = () => {
    setToken(null)
    setUserName(null)
    setIsAdmin(false)
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_name")
  }

  return <AuthContext.Provider value={{ token, userName, isAdmin, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
