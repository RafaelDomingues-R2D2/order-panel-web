import { api } from '@/lib/axios'

interface getProfileResponse {
  user: {
    id: string
    name: string
    email: string
    phone: string | null
    role: 'admin' | 'customer'
    createAt: Date | null
    updateAt: Date | null
  }
}

export async function getProfile() {
  const response = await api.get<getProfileResponse>('/profile')

  return response.data
}
