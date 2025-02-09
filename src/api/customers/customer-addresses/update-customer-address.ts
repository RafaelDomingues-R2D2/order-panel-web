import { api } from "@/lib/axios";

export interface UpdateCustomerAddressRequest {
	id: string;
	customerId?: string;
	street: string | null;
	number: string | null;
	neighborhood: string | null;
	city: string | null;
	state: string | null;
	postalCode: string | null;
}

export async function UpdateCustomerAddress({
	id,
	customerId,
	street,
	number,
	neighborhood,
	city,
	state,
	postalCode,
}: UpdateCustomerAddressRequest) {
	await api.put(`/customers-addresses/${id}`, {
		customerId,
		street,
		number,
		neighborhood,
		city,
		state,
		postalCode,
	});
}
