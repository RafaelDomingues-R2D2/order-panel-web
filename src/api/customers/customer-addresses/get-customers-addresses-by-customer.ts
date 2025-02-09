import { api } from "@/lib/axios";

interface getCustomerAddressesByCustomerResponse {
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

interface getCustomerAddressesRequest {
	customerId: string | null;
}

export async function getCustomerAddressesByCustomer({
	customerId,
}: getCustomerAddressesRequest) {
	const response = await api.get<getCustomerAddressesByCustomerResponse>(
		`/customers-addresses-by-customer/${customerId}`,
	);

	return response.data;
}
