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

export interface CreatePetDTO {
  name: string
  type: "DOG" | "CAT" | "FISH"
  color: "BROWN" | "VIOLET" | "STRIPED"
}

export interface UserRegistrationDTO {
  userName: string
  password: string
  email: string
}

export interface UserRegistrationResponseDTO {
  message: string
}
