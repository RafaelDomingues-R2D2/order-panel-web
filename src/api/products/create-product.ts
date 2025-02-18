import { api } from "@/lib/axios";

export interface CreateProductRequest {
	name: string;
	description: string;
	price: number;
	categoryId: string;
}

export async function CreateProduct({
	name,
	description,
	price,
	categoryId,
}: CreateProductRequest) {
	await api.post("/products", {
		name,
		description,
		price,
		categoryId,
	});
}
