import { api } from "@/lib/axios";

interface getCategoriesResponse {
	categories: {
		id: string;
		name: string;
		createdAt: Date | null;
		updatedAt: Date | null;
		description: string | null;
		organizationId: string;
	}[];
}

export async function getCategories() {
	const response = await api.get<getCategoriesResponse>("/categories");

	return response.data;
}
