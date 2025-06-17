const API_BASE_URL = "http://localhost:8080"

export interface LoginRequestDTO {
  userName: string
  password: string
}

export interface LoginResponseDTO {
  token: string
  userName: string
}

export interface PetResponseDTO {
  id: number
  name: string
  type: "DOG" | "CAT" | "FISH"
  color: "BROWN" | "VIOLET" | "STRIPED"
  energy: number
  hungry: boolean
  fun: number
}

export interface UserRegistrationDTO {
  userName: string
  password: string
  email: string
}

export interface UserRegistrationResponseDTO {
  id: number
  userName: string
  email: string
}

export interface CreatePetDTO {
  name: string
  type: "DOG" | "CAT" | "FISH"
  color: "BROWN" | "VIOLET" | "STRIPED"
  energy: number
  hungry: boolean
  fun: number
}

// Auth API calls
export async function loginUser(credentials: LoginRequestDTO): Promise<LoginResponseDTO> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    throw new Error("Login failed")
  }

  return response.json()
}

export async function registerUser(userData: UserRegistrationDTO): Promise<UserRegistrationResponseDTO> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    throw new Error("Registration failed")
  }

  return response.json()
}

// Pet API calls
export async function getAllPets(token: string): Promise<PetResponseDTO[]> {
  const response = await fetch(`${API_BASE_URL}/pets`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch pets")
  }

  return response.json()
}

export async function getPetById(id: number, token: string): Promise<PetResponseDTO> {
  const response = await fetch(`${API_BASE_URL}/pets/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch pet")
  }

  return response.json()
}

export async function createPet(petData: CreatePetDTO, token: string): Promise<PetResponseDTO> {
  const response = await fetch(`${API_BASE_URL}/pets`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(petData),
  })

  if (!response.ok) {
    throw new Error("Failed to create pet")
  }

  return response.json()
}

export async function updatePet(id: number, petData: CreatePetDTO, token: string): Promise<PetResponseDTO> {
  const response = await fetch(`${API_BASE_URL}/pets/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(petData),
  })

  if (!response.ok) {
    throw new Error("Failed to update pet")
  }

  return response.json()
}

export async function deletePet(id: number, token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/pets/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error("Failed to delete pet")
  }
}

// Pet action API calls
export async function feedPet(id: number, token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/pets/${id}/feed`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error("Failed to feed pet")
  }
}

export async function playWithPet(id: number, token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/pets/${id}/play`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error("Failed to play with pet")
  }
}

export async function sleepPet(id: number, token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/pets/${id}/sleep`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error("Failed to make pet sleep")
  }
}

// Add admin API functions at the end of the file

// Admin API calls
export async function getAllPetsAdmin(token: string): Promise<PetResponseDTO[]> {
  const response = await fetch(`${API_BASE_URL}/admin/pets`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch pets (admin)")
  }

  return response.json()
}

export async function updatePetAdmin(id: number, petData: CreatePetDTO, token: string): Promise<PetResponseDTO> {
  const response = await fetch(`${API_BASE_URL}/admin/pets/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(petData),
  })

  if (!response.ok) {
    throw new Error("Failed to update pet (admin)")
  }

  return response.json()
}

export async function deletePetAdmin(id: number, token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/admin/pets/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error("Failed to delete pet (admin)")
  }
}
