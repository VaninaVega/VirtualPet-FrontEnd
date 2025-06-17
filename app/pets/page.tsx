"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { getAllPets } from "@/lib/api"
import type { PetResponseDTO } from "@/types/api"
import { Heart, Zap, Gamepad2, LogOut, Plus, Shield } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { PetForm } from "@/components/pet-form"
import { createPet } from "@/lib/api"

export default function PetsPage() {
  const [pets, setPets] = useState<PetResponseDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()
  const { token, logout, userName, isAdmin } = useAuth()
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  useEffect(() => {
    if (!token) {
      router.push("/login")
      return
    }

    const fetchPets = async () => {
      try {
        const petsData = await getAllPets(token)
        setPets(petsData)
      } catch (err) {
        setError("Error al cargar las mascotas")
      } finally {
        setLoading(false)
      }
    }

    fetchPets()
  }, [token, router])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const handleCreatePet = async (petData: any) => {
    if (!token) return

    try {
      await createPet(petData, token)
      setShowCreateDialog(false)
      // Refresh pets list
      const petsData = await getAllPets(token)
      setPets(petsData)
    } catch (err) {
      throw err
    }
  }

  const getPetTypeEmoji = (type: string) => {
    switch (type) {
      case "DOG":
        return "🐕"
      case "CAT":
        return "🐱"
      case "FISH":
        return "🐠"
      default:
        return "🐾"
    }
  }

  const getColorBadge = (color: string) => {
    const colorMap = {
      BROWN: "bg-amber-100 text-amber-800",
      VIOLET: "bg-purple-100 text-purple-800",
      STRIPED: "bg-gray-100 text-gray-800",
    }
    return colorMap[color as keyof typeof colorMap] || "bg-gray-100 text-gray-800"
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mis Mascotas</h1>
            <p className="text-gray-600">Bienvenido, {userName}</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Mascota
                </Button>
              </DialogTrigger>
              <DialogContent>
                <PetForm
                  title="Crear Nueva Mascota"
                  description="Completa los datos para crear tu nueva mascota"
                  submitText="Crear Mascota"
                  onSubmit={handleCreatePet}
                  onCancel={() => setShowCreateDialog(false)}
                />
              </DialogContent>
            </Dialog>
            {isAdmin && (
              <Button onClick={() => router.push("/admin")} variant="secondary">
                <Shield className="w-4 h-4 mr-2" />
                Panel Admin
              </Button>
            )}
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {pets.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 text-lg">No tienes mascotas registradas</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <Card key={pet.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">{getPetTypeEmoji(pet.type)}</span>
                      {pet.name}
                    </CardTitle>
                    <Badge className={getColorBadge(pet.color)}>{pet.color.toLowerCase()}</Badge>
                  </div>
                  <CardDescription>
                    {pet.type.toLowerCase().charAt(0).toUpperCase() + pet.type.toLowerCase().slice(1)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm">Energía</span>
                      </div>
                      <span className="font-semibold">{pet.energy}/100</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span className="text-sm">Hambre</span>
                      </div>
                      <span className="font-semibold">{pet.hungry ? "Hambriento" : "Satisfecho"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Gamepad2 className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">Diversión</span>
                      </div>
                      <span className="font-semibold">{pet.fun}/100</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" onClick={() => router.push(`/pets/${pet.id}`)}>
                    Ver Detalles
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
