import { api } from "@/lib/axios";

export interface getOrderItemQuery {
	id: string;
}

export interface getOrderItemResponse {
	orderItem: {
		id: string;
		orderId: string;
		productId: string;
		quantity: string;
		total: string;
	};
}

export async function getOrderItem({ id }: getOrderItemQuery) {
	const response = await api.get<getOrderItemResponse>(`/order-items/${id}`);

	return response.data;
}
