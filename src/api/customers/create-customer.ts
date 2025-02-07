import { api } from "@/lib/axios";

export interface CreateCustomerRequest {
	name: string;
	email: string;
	phone: string;
}

export async function CreateCustomer({
	name,
	email,
	phone,
}: CreateCustomerRequest) {
	await api.post("/customers", {
		name,
		email,
		phone,
	});
}
