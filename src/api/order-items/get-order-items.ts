import { api } from "@/lib/axios";

export interface getOrderItemsResponse {
	orderItems: {
		id: string;
		orderId: string;
		total: number | null;
		productId: string;
		quantity: number | null;
		productName: string;
	}[];
}

export interface getOrdersQuery {
	orderId: string;
}

export async function getOrderItems({ orderId }: getOrdersQuery) {
	const response = await api.get<getOrderItemsResponse>(
		`/order-items?orderId=${orderId}`,
	);

	return response.data;
}
