"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const HALLS = ["Jeshi", "Malaika", "Tana", "Zambezi", "Classified", "Office", "Titans"]

export function LoginScreen() {
  const { login } = useAuth()
  const [studentId, setStudentId] = useState("")
  const [name, setName] = useState("")
  const [hall, setHall] = useState("")
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    const newErrors: { [key: string]: string } = {}
    if (!studentId.trim()) newErrors.studentId = "Student ID is required"
    if (!name.trim()) newErrors.name = "Name is required"
    if (!hall) newErrors.hall = "Hall is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Login
    login({ studentId: studentId.trim(), name: name.trim(), hall })
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-10-01%20at%2011.39.02%20AM-3-3gp6CFvGQYJpFbsy3TCuEs43Z60Fo8.jpeg')",
        }}
      >
        {/* Overlay for better readability */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Login Card */}
      <Card className="relative w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">RAFIKI</CardTitle>
          <CardDescription className="text-base">Welcome to African Leadership Academy</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID</Label>
              <Input
                id="studentId"
                type="text"
                placeholder="Enter your student ID"
                value={studentId}
                onChange={(e) => {
                  setStudentId(e.target.value)
                  setErrors((prev) => ({ ...prev, studentId: "" }))
                }}
                className={errors.studentId ? "border-red-500" : ""}
              />
              {errors.studentId && <p className="text-sm text-red-500">{errors.studentId}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setErrors((prev) => ({ ...prev, name: "" }))
                }}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hall">Current Hall</Label>
              <Select
                value={hall}
                onValueChange={(value) => {
                  setHall(value)
                  setErrors((prev) => ({ ...prev, hall: "" }))
                }}
              >
                <SelectTrigger className={errors.hall ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select your hall" />
                </SelectTrigger>
                <SelectContent>
                  {HALLS.map((hallOption) => (
                    <SelectItem key={hallOption} value={hallOption}>
                      {hallOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.hall && <p className="text-sm text-red-500">{errors.hall}</p>}
            </div>

            <Button type="submit" className="w-full" size="lg">
              Login to RAFIKI
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
