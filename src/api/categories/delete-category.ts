import { api } from "@/lib/axios";

export interface DeleteCategoryRequest {
	id: string;
}

export async function DeleteCategory({ id }: DeleteCategoryRequest) {
	await api.delete(`/categories/${id}`);
}
