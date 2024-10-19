import { api } from '@/lib/axios'

interface SingInBody {
  email: string
  password: string
}
interface SingInResponse {
  token: string
}

export async function signIn({ email, password }: SingInBody) {
  const result = await api.post<SingInResponse>('sessions/password', {
    email,
    password,
  })

  return result
}
