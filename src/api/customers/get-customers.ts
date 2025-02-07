import { api } from '@/lib/axios'

interface getCustomersResponse {
	customers: {
		id: string
		organizationId: string
		name: string
		email: string
		phone: string | null
	}[]
}

export async function getCustomers() {
	const response = await api.get<getCustomersResponse>('/customers')

	return response.data
}
