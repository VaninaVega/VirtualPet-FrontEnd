"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { CreatePetDTO, PetResponseDTO } from "@/types/api"

interface PetFormProps {
  initialData?: PetResponseDTO
  onSubmit: (data: CreatePetDTO) => Promise<void>
  onCancel: () => void
  title: string
  description: string
  submitText: string
}

export function PetForm({ initialData, onSubmit, onCancel, title, description, submitText }: PetFormProps) {
  const [formData, setFormData] = useState<CreatePetDTO>({
    name: initialData?.name || "",
    type: initialData?.type || "DOG",
    color: initialData?.color || "BROWN",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await onSubmit(formData)
    } catch (err) {
      setError("Error al procesar la solicitud")
    } finally {
      setLoading(false)
    }
  }

  const getPetTypeEmoji = (type: string) => {
    switch (type) {
      case "DOG":
        return "🐕 Perro"
      case "CAT":
        return "🐱 Gato"
      case "FISH":
        return "🐠 Pez"
      default:
        return "🐾 Mascota"
    }
  }

  const getColorName = (color: string) => {
    switch (color) {
      case "BROWN":
        return "🤎 Marrón"
      case "VIOLET":
        return "🟣 Violeta"
      case "STRIPED":
        return "🔘 Rayado"
      default:
        return color
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la Mascota</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              required
              placeholder="Ingresa el nombre de tu mascota"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Mascota</Label>
            <Select
              value={formData.type}
              onValueChange={(value: "DOG" | "CAT" | "FISH") => setFormData((prev) => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DOG">{getPetTypeEmoji("DOG")}</SelectItem>
                <SelectItem value="CAT">{getPetTypeEmoji("CAT")}</SelectItem>
                <SelectItem value="FISH">{getPetTypeEmoji("FISH")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Select
              value={formData.color}
              onValueChange={(value: "BROWN" | "VIOLET" | "STRIPED") =>
                setFormData((prev) => ({ ...prev, color: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BROWN">{getColorName("BROWN")}</SelectItem>
                <SelectItem value="VIOLET">{getColorName("VIOLET")}</SelectItem>
                <SelectItem value="STRIPED">{getColorName("STRIPED")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Procesando..." : submitText}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
