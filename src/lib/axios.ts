import axios from 'axios'
import Cookies from 'js-cookie'

import { env } from '@/env'

export const api = axios.create({
  baseURL: env.VITE_API_URL,
})

api.interceptors.request.use((request) => {
  const headers = request.headers ?? {}

  const token = Cookies.get('pato-rico')

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  request.headers = headers
  return request
})
