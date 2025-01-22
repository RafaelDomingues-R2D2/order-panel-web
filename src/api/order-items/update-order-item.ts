import { api } from "@/lib/axios";

export interface UpdateOrderItemRequest {
	id: string;
	productId: string;
	quantity: number;
}

export async function UpdateOrderItem({
	id,
	productId,
	quantity,
}: UpdateOrderItemRequest) {
	await api.put(`/order-items/${id}`, {
		productId,
		quantity,
	});
}
