import { api } from "@/lib/axios";

export interface CreateOrderRequest {
	id?: string;
	customerId: string;
	deliveryDate: string;
	pickupeByCustomer: boolean;
}

export interface CreateOrderResponse {
	order: {
		id: string;
		customerId: string;
		shippingAddressId: string;
		organizationId: string;
		orderStageId: string;
		totalAmount: null;
		totalItems: number;
		priority: string;
		deliveryDate: string;
		createdAt: string;
	};
}

export async function CreateOrder({
	customerId,
	deliveryDate,
	pickupeByCustomer,
}: CreateOrderRequest) {
	return await api.post<CreateOrderResponse>("/orders", {
		customerId,
		deliveryDate,
		pickupeByCustomer,
	});
}
