import { api } from "@/lib/axios";

export interface DeleteProoductRequest {
	id: string;
}

export async function DeleteProduct({ id }: DeleteProoductRequest) {
	await api.delete(`/products/${id}`);
}
