import { api } from "@/lib/axios";

export interface UpdateCategoryRequest {
	id: string;
	name: string;
	email: string;
	phone: string;
}

export async function UpdateCategory({
	id,
	name,
	email,
	phone,
}: UpdateCategoryRequest) {
	await api.put(`/categories/${id}`, {
		name,
		email,
		phone,
	});
}
