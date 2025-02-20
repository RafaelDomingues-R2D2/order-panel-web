import { Button } from "@/components/ui/button";
import {
	DialogContent,
	DialogFooter,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { StockEntry } from "@/api/products/stock-entry";
import { queryClient } from "@/lib/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export interface StockEntryProps {
	setIsStockEntryFormOpen: (isOpen: boolean) => void;
	product?: {
		id: string;
		name: string | null;
		description: string | null;
		stock: number | null;
		price: number | null;
		categoryId: string;
		categoryName: string | null;
	};
}

const productInputSchema = z.object({
	stock: z
		.string()
		.min(1, { message: "Este campo é obrigatório" })
		.refine(
			(value) => {
				const numberValue = Number.parseFloat(value);
				return numberValue > 0;
			},
			{
				message: "O valor tem quer ser positivo",
			},
		),
});

type StockEntrySchema = z.infer<typeof productInputSchema>;

export function StockEntryForm({
	setIsStockEntryFormOpen,
	product,
}: StockEntryProps) {
	const {
		register,
		handleSubmit,
		formState: { isSubmitting, errors },
		reset,
	} = useForm<StockEntrySchema>({
		resolver: zodResolver(productInputSchema),
		values: {
			stock: "",
		},
	});

	const { mutateAsync: stockEntry } = useMutation({
		mutationFn: StockEntry,
	});

	async function handleStockEntry({ stock }: StockEntrySchema) {
		try {
			await stockEntry({
				id: String(product?.id),
				stock: Number(stock),
			});

			toast.success("Produto Atualizada!");
			setIsStockEntryFormOpen(false);
			reset();
			queryClient.invalidateQueries({ queryKey: ["products"] });
		} catch (err) {
			toast.error("Erro ao atualizar a produto");
		}
	}

	return (
		<DialogContent className="min-w-96">
			<DialogTitle> </DialogTitle>
			<form
				onSubmit={handleSubmit(handleStockEntry)}
				className="flex flex-col gap-1"
			>
				<div className="mb-6 flex flex-col w-full">
					<Label className="mb-2">Estoque</Label>
					<Input
						id="stock"
						type="text"
						autoCorrect="off"
						{...register("stock")}
					/>
					{errors.stock && (
						<span className="text-xs font-medium text-red-500 dark:text-red-400 absolute mt-16">
							{errors.stock.message}
						</span>
					)}
				</div>

				<DialogFooter>
					<Button type="submit" disabled={isSubmitting} className="w-full">
						{isSubmitting ? (
							<Loader2 className="h-6 w-6 animate-spin text-gray-50" />
						) : (
							<Label>Adicionar</Label>
						)}
					</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	);
}
