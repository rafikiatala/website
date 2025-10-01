"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface Student {
  studentId: string
  name: string
  hall: string
}

interface AuthContextType {
  student: Student | null
  isAuthenticated: boolean
  login: (student: Student) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<Student | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const storedStudent = localStorage.getItem("rafiki_student")
    if (storedStudent) {
      setStudent(JSON.parse(storedStudent))
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const login = (studentData: Student) => {
    setStudent(studentData)
    setIsAuthenticated(true)
    localStorage.setItem("rafiki_student", JSON.stringify(studentData))
  }

  const logout = () => {
    setStudent(null)
    setIsAuthenticated(false)
    localStorage.removeItem("rafiki_student")
  }

  if (isLoading) {
    return null
  }

  return <AuthContext.Provider value={{ student, isAuthenticated, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
