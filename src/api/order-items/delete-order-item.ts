import { api } from "@/lib/axios";

export interface DeleteOrderItemRequest {
	id: string;
}

export async function DeleteOrderItem({ id }: DeleteOrderItemRequest) {
	await api.delete(`/order-items/${id}`);
}
