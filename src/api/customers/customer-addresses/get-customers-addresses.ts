import { api } from "@/lib/axios";

interface getCustomerAddressesResponse {
	customerAddresses: {
		id: string;
		customerId: string;
		street: string | null;
		number: string | null;
		neighborhood: string | null;
		city: string | null;
		state: string | null;
		postalCode: string | null;
		createdAt: Date;
		updatedAt: Date;
		organizationId: string;
		addressType: "BILLING" | "SHIPPING";
	}[];
}

export async function getCustomerAddresses() {
	const response = await api.get<getCustomerAddressesResponse>(
		"/customers-addresses",
	);

	return response.data;
}
