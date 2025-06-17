"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function HomePage() {
  const router = useRouter()
  // Update the useAuth destructuring to include isAdmin
  const { token, isAdmin } = useAuth()

  // Update the useEffect to redirect to admin if user is admin
  useEffect(() => {
    if (token) {
      if (isAdmin) {
        router.push("/admin")
      } else {
        router.push("/pets")
      }
    } else {
      router.push("/login")
    }
  }, [token, isAdmin, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  )
}
