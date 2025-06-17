interface JWTPayload {
  sub: string
  authorities: string[]
  exp: number
  iat: number
}

export function decodeJWT(token: string): JWTPayload | null {
  try {
    // Split the token and get the payload part
    const parts = token.split(".")
    if (parts.length !== 3) {
      return null
    }

    // Decode the payload (base64url)
    const payload = parts[1]
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    return JSON.parse(decoded)
  } catch (error) {
    console.error("Error decoding JWT:", error)
    return null
  }
}

export function hasAuthority(token: string, authority: string): boolean {
  const payload = decodeJWT(token)
  if (!payload || !payload.authorities) {
    return false
  }
  return payload.authorities.includes(authority)
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token)
  if (!payload) {
    return true
  }

  const currentTime = Math.floor(Date.now() / 1000)
  return payload.exp < currentTime
}
