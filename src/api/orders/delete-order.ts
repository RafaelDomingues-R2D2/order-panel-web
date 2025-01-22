import { api } from "@/lib/axios";

export interface DeleteOrderRequest {
	id: string;
}

export async function DeleteOrder({ id }: DeleteOrderRequest) {
	await api.delete(`/orders/${id}`);
}
