import { api } from "@/lib/axios";

export interface CreateCategoryRequest {
	name: string;
	description: string | null;
}

export async function CreateCategory({
	name,
	description,
}: CreateCategoryRequest) {
	await api.post("/categories", {
		name,
		description,
	});
}
