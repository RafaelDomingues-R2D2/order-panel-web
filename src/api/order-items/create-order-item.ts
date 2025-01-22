import { api } from "@/lib/axios";

export interface CreateOrderitemsRequest {
	orderId: string;
	productId: string;
	quantity: number;
}

export async function CreateOrderItem({
	orderId,
	productId,
	quantity,
}: CreateOrderitemsRequest) {
	await api.post("/order-items", {
		orderId,
		productId,
		quantity,
	});
}
