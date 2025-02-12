import { api } from "@/lib/axios";

export interface UpdateOrderRequest {
	id: string;
	customerId?: string;
	deliveryDate?: string;
	pickupeByCustomer?: boolean;
}

export async function UpdateOrder({
	id,
	customerId,
	deliveryDate,
	pickupeByCustomer,
}: UpdateOrderRequest) {
	await api.put(`/orders/${id}`, {
		customerId,
		deliveryDate,
		pickupeByCustomer,
	});
}
