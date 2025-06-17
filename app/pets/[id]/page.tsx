"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/auth-context"
import { getPetById, feedPet, playWithPet, sleepPet, updatePet, deletePet } from "@/lib/api"
import type { PetResponseDTO } from "@/types/api"
import { ArrowLeft, Heart, Zap, Gamepad2, Utensils, Moon, Edit, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { PetForm } from "@/components/pet-form"

export default function PetDetailPage() {
  const [pet, setPet] = useState<PetResponseDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()
  const params = useParams()
  const { token } = useAuth()
  const petId = params.id as string

  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      router.push("/login")
      return
    }

    const fetchPet = async () => {
      try {
        const petData = await getPetById(Number.parseInt(petId), token)
        setPet(petData)
      } catch (err) {
        setError("Error al cargar la mascota")
      } finally {
        setLoading(false)
      }
    }

    fetchPet()
  }, [token, petId, router])

  const handleAction = async (action: "feed" | "play" | "sleep") => {
    if (!pet || !token) return

    setActionLoading(action)
    setError("")
    setSuccess("")

    try {
      switch (action) {
        case "feed":
          await feedPet(pet.id, token)
          setSuccess("¡Mascota alimentada!")
          break
        case "play":
          await playWithPet(pet.id, token)
          setSuccess("¡Jugaste con tu mascota!")
          break
        case "sleep":
          await sleepPet(pet.id, token)
          setSuccess("¡Tu mascota está descansando!")
          break
      }

      // Refresh pet data
      const updatedPet = await getPetById(pet.id, token)
      setPet(updatedPet)
    } catch (err) {
      setError("Error al realizar la acción")
    } finally {
      setActionLoading("")
    }
  }

  const handleEditPet = async (petData: any) => {
    if (!pet || !token) return

    try {
      const updatedPet = await updatePet(pet.id, petData, token)
      setPet(updatedPet)
      setShowEditDialog(false)
      setSuccess("¡Mascota actualizada correctamente!")
    } catch (err) {
      throw err
    }
  }

  const handleDeletePet = async () => {
    if (!pet || !token) return

    setDeleteLoading(true)
    try {
      await deletePet(pet.id, token)
      router.push("/pets")
    } catch (err) {
      setError("Error al eliminar la mascota")
    } finally {
      setDeleteLoading(false)
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

  if (!pet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 text-lg">Mascota no encontrada</p>
            <Button onClick={() => router.push("/pets")} className="mt-4">
              Volver a Mascotas
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button onClick={() => router.push("/pets")} variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Mascotas
          </Button>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <span className="text-4xl">{getPetTypeEmoji(pet.type)}</span>
                  <div>
                    <h2 className="text-2xl">{pet.name}</h2>
                    <p className="text-sm text-gray-500 font-normal">ID: {pet.id}</p>
                  </div>
                </CardTitle>
                <Badge className={getColorBadge(pet.color)}>{pet.color.toLowerCase()}</Badge>
              </div>
              <CardDescription>
                {pet.type.toLowerCase().charAt(0).toUpperCase() + pet.type.toLowerCase().slice(1)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      <span className="font-medium">Energía</span>
                    </div>
                    <span className="font-bold text-lg">{pet.energy}/100</span>
                  </div>
                  <Progress value={pet.energy} className="h-3" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-red-500" />
                      <span className="font-medium">Estado de Hambre</span>
                    </div>
                    <Badge variant={pet.hungry ? "destructive" : "secondary"}>
                      {pet.hungry ? "Hambriento" : "Satisfecho"}
                    </Badge>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Gamepad2 className="w-5 h-5 text-blue-500" />
                      <span className="font-medium">Diversión</span>
                    </div>
                    <span className="font-bold text-lg">{pet.fun}/100</span>
                  </div>
                  <Progress value={pet.fun} className="h-3" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
              <CardDescription>Cuida de tu mascota realizando diferentes acciones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button
                  onClick={() => handleAction("feed")}
                  disabled={actionLoading !== ""}
                  className="w-full"
                  variant={pet.hungry ? "default" : "secondary"}
                >
                  <Utensils className="w-4 h-4 mr-2" />
                  {actionLoading === "feed" ? "Alimentando..." : "Alimentar"}
                </Button>

                <Button
                  onClick={() => handleAction("play")}
                  disabled={actionLoading !== ""}
                  className="w-full"
                  variant={pet.fun < 50 ? "default" : "secondary"}
                >
                  <Gamepad2 className="w-4 h-4 mr-2" />
                  {actionLoading === "play" ? "Jugando..." : "Jugar"}
                </Button>

                <Button
                  onClick={() => handleAction("sleep")}
                  disabled={actionLoading !== ""}
                  className="w-full"
                  variant={pet.energy < 50 ? "default" : "secondary"}
                >
                  <Moon className="w-4 h-4 mr-2" />
                  {actionLoading === "sleep" ? "Durmiendo..." : "Dormir"}
                </Button>

                <div className="border-t pt-4 space-y-2">
                  <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <Edit className="w-4 h-4 mr-2" />
                        Editar Mascota
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <PetForm
                        initialData={pet}
                        title="Editar Mascota"
                        description="Modifica los datos de tu mascota"
                        submitText="Guardar Cambios"
                        onSubmit={handleEditPet}
                        onCancel={() => setShowEditDialog(false)}
                      />
                    </DialogContent>
                  </Dialog>

                  <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar Mascota
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <div className="text-center space-y-4">
                        <h3 className="text-lg font-semibold">¿Eliminar mascota?</h3>
                        <p className="text-gray-600">
                          ¿Estás seguro de que quieres eliminar a {pet.name}? Esta acción no se puede deshacer.
                        </p>
                        <div className="flex gap-2 justify-center">
                          <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={deleteLoading}>
                            Cancelar
                          </Button>
                          <Button variant="destructive" onClick={handleDeletePet} disabled={deleteLoading}>
                            {deleteLoading ? "Eliminando..." : "Eliminar"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
