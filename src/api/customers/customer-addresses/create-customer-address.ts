import { api } from "@/lib/axios";

export interface CreateCustomerAddressRequest {
	customerId: string;
	street: string | null;
	number: string | null;
	neighborhood: string | null;
	city: string | null;
	state: string | null;
	postalCode: string | null;
}

export async function CreateCustomerAddress({
	customerId,
	street,
	number,
	neighborhood,
	city,
	state,
	postalCode,
}: CreateCustomerAddressRequest) {
	await api.post("/customers-addresses", {
		customerId,
		street,
		number,
		neighborhood,
		city,
		state,
		postalCode,
	});
}
