import { api } from "@/lib/axios";

interface getProductsResponse {
	products: {
		id: string;
		name: string;
		description: string | null;
		stock: number | null;
		price: number | null;
		categoryId: string;
		categoryName: string | null;
	}[];
}

export async function getProducts() {
	const response = await api.get<getProductsResponse>("/products");

	return response.data;
}
