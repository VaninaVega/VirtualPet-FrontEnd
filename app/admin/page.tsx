"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { getAllPetsAdmin, updatePetAdmin, deletePetAdmin } from "@/lib/api"
import type { PetResponseDTO } from "@/types/api"
import { Heart, Zap, Gamepad2, LogOut, Edit, Trash2, Shield, ArrowLeft } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { PetForm } from "@/components/pet-form"

export default function AdminPage() {
  const [pets, setPets] = useState<PetResponseDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()
  const { token, logout, userName, isAdmin } = useAuth()
  const [editingPet, setEditingPet] = useState<PetResponseDTO | null>(null)
  const [deletingPet, setDeletingPet] = useState<PetResponseDTO | null>(null)
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  useEffect(() => {
    if (!token) {
      router.push("/login")
      return
    }

    if (!isAdmin) {
      router.push("/pets")
      return
    }

    const fetchPets = async () => {
      try {
        const petsData = await getAllPetsAdmin(token)
        setPets(petsData)
      } catch (err) {
        setError("Error al cargar las mascotas")
      } finally {
        setLoading(false)
      }
    }

    fetchPets()
  }, [token, isAdmin, router])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const handleEditPet = async (petData: any) => {
    if (!editingPet || !token) return

    setActionLoading(editingPet.id)
    try {
      await updatePetAdmin(editingPet.id, petData, token)
      setEditingPet(null)
      setSuccess(`Mascota ${petData.name} actualizada correctamente`)

      // Refresh pets list
      const petsData = await getAllPetsAdmin(token)
      setPets(petsData)
    } catch (err) {
      setError("Error al actualizar la mascota")
      throw err
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeletePet = async (pet: PetResponseDTO) => {
    if (!token) return

    setActionLoading(pet.id)
    try {
      await deletePetAdmin(pet.id, token)
      setDeletingPet(null)
      setSuccess(`Mascota ${pet.name} eliminada correctamente`)

      // Refresh pets list
      const petsData = await getAllPetsAdmin(token)
      setPets(petsData)
    } catch (err) {
      setError("Error al eliminar la mascota")
    } finally {
      setActionLoading(null)
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

  const getOwnerInfo = (pet: PetResponseDTO) => {
    // This would typically come from the API response
    // For now, we'll show a placeholder
    return `Usuario #${Math.floor(pet.id / 10) + 1}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="text-center py-12">
            <Shield className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <p className="text-gray-500 text-lg mb-4">Acceso denegado</p>
            <p className="text-gray-400 mb-4">No tienes permisos de administrador</p>
            <Button onClick={() => router.push("/pets")}>Volver a Mascotas</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-6 h-6 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Panel de Administrador</h1>
            </div>
            <p className="text-gray-600">Bienvenido, {userName} - Gestión de todas las mascotas</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => router.push("/pets")} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Mis Mascotas
            </Button>
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

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <div className="mb-6">
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{pets.length}</p>
                    <p className="text-sm text-gray-500">Total Mascotas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{pets.filter((pet) => !pet.hungry).length}</p>
                    <p className="text-sm text-gray-500">Bien Alimentadas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">{pets.filter((pet) => pet.energy > 50).length}</p>
                    <p className="text-sm text-gray-500">Con Buena Energía</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {pets.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 text-lg">No hay mascotas registradas en el sistema</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <Card key={pet.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">{getPetTypeEmoji(pet.type)}</span>
                      {pet.name}
                    </CardTitle>
                    <Badge className={getColorBadge(pet.color)}>{pet.color.toLowerCase()}</Badge>
                  </div>
                  <CardDescription>
                    <div className="space-y-1">
                      <p>{pet.type.toLowerCase().charAt(0).toUpperCase() + pet.type.toLowerCase().slice(1)}</p>
                      <p className="text-xs text-blue-600">Propietario: {getOwnerInfo(pet)}</p>
                      <p className="text-xs text-gray-400">ID: {pet.id}</p>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
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
                      <Badge variant={pet.hungry ? "destructive" : "secondary"}>
                        {pet.hungry ? "Hambriento" : "Satisfecho"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Gamepad2 className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">Diversión</span>
                      </div>
                      <span className="font-semibold">{pet.fun}/100</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Dialog open={editingPet?.id === pet.id} onOpenChange={(open) => !open && setEditingPet(null)}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setEditingPet(pet)}
                          disabled={actionLoading === pet.id}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <PetForm
                          initialData={pet}
                          title="Editar Mascota (Admin)"
                          description={`Modificar los datos de ${pet.name}`}
                          submitText="Guardar Cambios"
                          onSubmit={handleEditPet}
                          onCancel={() => setEditingPet(null)}
                        />
                      </DialogContent>
                    </Dialog>

                    <Dialog open={deletingPet?.id === pet.id} onOpenChange={(open) => !open && setDeletingPet(null)}>
                      <DialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex-1"
                          onClick={() => setDeletingPet(pet)}
                          disabled={actionLoading === pet.id}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Eliminar
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <div className="text-center space-y-4">
                          <div className="flex justify-center">
                            <span className="text-4xl">{getPetTypeEmoji(pet.type)}</span>
                          </div>
                          <h3 className="text-lg font-semibold">¿Eliminar mascota?</h3>
                          <div className="space-y-2">
                            <p className="text-gray-600">
                              ¿Estás seguro de que quieres eliminar a <strong>{pet.name}</strong>?
                            </p>
                            <p className="text-sm text-gray-500">Propietario: {getOwnerInfo(pet)}</p>
                            <p className="text-sm text-red-600 font-medium">Esta acción no se puede deshacer.</p>
                          </div>
                          <div className="flex gap-2 justify-center">
                            <Button
                              variant="outline"
                              onClick={() => setDeletingPet(null)}
                              disabled={actionLoading === pet.id}
                            >
                              Cancelar
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDeletePet(pet)}
                              disabled={actionLoading === pet.id}
                            >
                              {actionLoading === pet.id ? "Eliminando..." : "Eliminar"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
