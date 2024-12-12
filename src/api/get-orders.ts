import { api } from '@/lib/axios'

export interface Task {
  id: string;
  createdAt: Date | null;
  organizationId: string;
  customerId: string;
  shippingAddressId: string;
  totalAmount: number | null;
  totalItems: number | null;
  orderStageId: string,
  priority:  'URGENT' | 'HIGH' | 'NORMAL' | 'LOW';
}

export interface getOrdersResponse {
    'TODO': Task[];
    'DOING': Task[];
    'DONE': Task[];
}


export async function getOrders() {
  const response = await api.get<getOrdersResponse>('/orders')

  return response.data
}
