import { api } from "@/lib/axios";

export interface DeleteCustomerRequest {
	id: string;
}

export async function DeleteCustomer({ id }: DeleteCustomerRequest) {
	await api.delete(`/customers/${id}`);
}
