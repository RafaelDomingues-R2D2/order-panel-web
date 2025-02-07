import { api } from "@/lib/axios";

export interface UpdateProductsRequest {
	id: string;
	name: string;
	description: string;
	price: number;
	stock: number;
	categoryId: string;
}

export async function UpdateProduct({
	id,
	name,
	description,
	price,
	stock,
	categoryId,
}: UpdateProductsRequest) {
	await api.put(`/products/${id}`, {
		name,
		description,
		price,
		stock,
		categoryId,
	});
}
