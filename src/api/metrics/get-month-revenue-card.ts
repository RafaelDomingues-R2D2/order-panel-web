import { api } from "@/lib/axios";

export interface GetmonthRevenueCardResponse {
	revenue: number;
	diffFromLastMonth: number;
}

export async function getMonthRevenueCard() {
	const response = await api.get<GetmonthRevenueCardResponse>(
		"/metrics/month-revenue",
	);

	return response.data;
}
