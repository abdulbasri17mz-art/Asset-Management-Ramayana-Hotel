"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name: string
  role: "admin" | "staff" | "viewer"
  profilePhoto?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  updateUserProfile: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("hotel-ams-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const updateUserProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem("hotel-ams-user", JSON.stringify(updatedUser))
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock authentication - in real app, this would be an API call
    if (email === "bas@ramayanahotel.com" && password === "Husky1212") {
      const mockUser: User = {
        id: "1",
        email: "bas@ramayanahotel.com",
        name: "Abdul Basri",
        role: "admin",
        profilePhoto: "/hotel-manager-avatar.png",
      }
      setUser(mockUser)
      localStorage.setItem("hotel-ams-user", JSON.stringify(mockUser))
      setIsLoading(false)
      return true
    } else if (email === "staff@ramayanahotel.com" && password === "staff123") {
      const mockUser: User = {
        id: "2",
        email: "staff@ramayanahotel.com",
        name: "Staff User",
        role: "staff",
        profilePhoto: "/hotel-manager-avatar.png",
      }
      setUser(mockUser)
      localStorage.setItem("hotel-ams-user", JSON.stringify(mockUser))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock registration
    const mockUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role: "staff",
      profilePhoto: "/hotel-manager-avatar.png",
    }
    setUser(mockUser)
    localStorage.setItem("hotel-ams-user", JSON.stringify(mockUser))
    setIsLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("hotel-ams-user")
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
