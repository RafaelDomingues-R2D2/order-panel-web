import { api } from "@/lib/axios";

export interface StockEntryRequest {
	id: string;
	stock: number;
}

export async function StockEntry({ id, stock }: StockEntryRequest) {
	await api.patch(`/products/stock-entry/${id}`, {
		stock,
	});
}
