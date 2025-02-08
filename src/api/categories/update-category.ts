import { api } from "@/lib/axios";

export interface UpdateCategoryRequest {
	id: string;
	name: string;
	description: string | null;
}

export async function UpdateCategory({
	id,
	name,
	description,
}: UpdateCategoryRequest) {
	await api.put(`/categories/${id}`, {
		id,
		name,
		description,
	});
}
