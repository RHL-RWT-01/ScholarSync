// API configuration and utilities
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(errorData.message || `HTTP ${response.status}`, response.status, errorData.code)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError("Network error occurred", 0)
  }
}

// Utility for handling file uploads
export async function uploadFile(file: File, endpoint: string): Promise<any> {
  const formData = new FormData()
  formData.append("file", file)

  return apiCall(endpoint, {
    method: "POST",
    body: formData,
    headers: {}, // Let browser set Content-Type for FormData
  })
}
