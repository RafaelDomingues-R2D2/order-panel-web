import { api } from "@/lib/axios";

interface getProductsResponse {
	products: {
		id: string;
		name: string | null;
		createdAt: Date | null;
		description: string | null;
		organizationId: string;
		categoryId: string;
		price: number | null;
		stock: number | null;
	}[];
}

export async function getProducts() {
	const response = await api.get<getProductsResponse>("/products");

	return response.data;
}
