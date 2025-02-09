import { api } from "@/lib/axios";

export interface DeleteCustomerAddressRequest {
	id: string;
}

export async function DeleteCustomerAddress({
	id,
}: DeleteCustomerAddressRequest) {
	await api.delete(`/customers-addresses/${id}`);
}
