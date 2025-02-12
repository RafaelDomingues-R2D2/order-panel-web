import { api } from "@/lib/axios";

export interface getOrdersQuery {
	id: string;
}

export interface getOrdersResponse {
	order: {
		id: string;
		deliveryDate: string;
		pickupeByCustomer: boolean;
		customerId: string;
		customerName: string;
		customerPhone: string;
	};
}

export async function getOrder({ id }: getOrdersQuery) {
	const response = await api.get<getOrdersResponse>(`/orders/${id}`);

	return response.data;
}
