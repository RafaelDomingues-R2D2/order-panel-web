import { api } from "@/lib/axios";

export interface UpdateOrderRequest {
	id: string;
	customerId?: string;
	deliveryDate?: string;
}

export async function UpdateOrder({
	id,
	customerId,
	deliveryDate,
}: UpdateOrderRequest) {
	await api.put(`/orders/${id}`, {
		customerId,
		deliveryDate,
	});
}
