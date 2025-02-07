import { api } from "@/lib/axios";

export interface CreateProductRequest {
	name: string;
	description: string;
	price: number;
	stock: number;
	categoryId: string;
}

export async function CreateProduct({
	name,
	description,
	price,
	stock,
	categoryId,
}: CreateProductRequest) {
	await api.post("/products", {
		name,
		description,
		price,
		stock,
		categoryId,
	});
}
