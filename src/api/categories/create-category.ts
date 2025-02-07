import { api } from "@/lib/axios";

export interface CreateCategoryRequest {
	name: string;
	email: string;
	phone: string;
}

export async function CreateCategory({
	name,
	email,
	phone,
}: CreateCategoryRequest) {
	await api.post("/categories", {
		name,
		email,
		phone,
	});
}
