import { api } from "@/lib/axios";

export interface UpdateCustomerRequest {
	id: string;
	name: string;
	email: string;
	phone: string;
}

export async function UpdateCustomer({
	id,
	name,
	email,
	phone,
}: UpdateCustomerRequest) {
	await api.put(`/customers/${id}`, {
		name,
		email,
		phone,
	});
}
