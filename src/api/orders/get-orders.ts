import { api } from "@/lib/axios";

export interface Task {
	id: string;
	deliveryDate: string;
	customerId: string;
	customerName: string;
	customerPhone: string;
	totalAmount: number | null;
	totalItems: number | null;
}

export interface getOrdersResponse {
	TODO: Task[];
	DOING: Task[];
	DONE: Task[];
}

export async function getOrders() {
	const response = await api.get<getOrdersResponse>("/orders");

	return response.data;
}
