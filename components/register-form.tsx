"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { registerUser } from "@/lib/api"
import type { UserRegistrationDTO } from "@/types/api"

interface RegisterFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export function RegisterForm({ onSuccess, onCancel }: RegisterFormProps) {
  const [formData, setFormData] = useState<UserRegistrationDTO>({
    userName: "",
    password: "",
    email: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await registerUser(formData)
      setSuccess(response.message)
      setTimeout(() => {
        onSuccess()
      }, 2000)
    } catch (err) {
      setError("Error al registrar usuario. Verifica los datos ingresados.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof UserRegistrationDTO) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Registrarse</CardTitle>
        <CardDescription className="text-center">Crea una nueva cuenta para acceder a la aplicación</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userName">Nombre de Usuario</Label>
            <Input
              id="userName"
              type="text"
              value={formData.userName}
              onChange={handleChange("userName")}
              required
              placeholder="Ingresa tu nombre de usuario"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange("email")}
              required
              placeholder="Ingresa tu email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange("password")}
              required
              placeholder="Ingresa tu contraseña"
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Registrando..." : "Registrarse"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
