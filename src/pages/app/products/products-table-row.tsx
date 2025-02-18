import { DeleteProduct } from "@/api/products/delete-product";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { queryClient } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { PackagePlus, PencilLine, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ProductForm } from "./product-form";
import { StockEntryForm } from "./stock-entry-form";

export interface ProductsTableRowProps {
	products: {
		id: string;
		name: string | null;
		description: string | null;
		stock: number | null;
		price: number | null;
		categoryId: string;
		categoryName: string | null;
	};
}

export function ProductsTablerRow({ products }: ProductsTableRowProps) {
	const [isProductFormOpen, setIsProductFormOpen] = useState(false);
	const [stockEntryFormOpen, setIsStockEntryFormOpen] = useState(false);

	const { mutateAsync: deleteProduct } = useMutation({
		mutationFn: DeleteProduct,
	});

	async function handleDeleteProduct(id: string) {
		try {
			await deleteProduct({ id });

			toast.success("Produto Deletado!");
			queryClient.invalidateQueries({ queryKey: ["products"] });
		} catch (err) {
			toast.error("Erro ao deletar o produto");
		}
	}

	return (
		<>
			<TableRow>
				<TableCell className="font-medium">{products.name}</TableCell>
				<TableCell className="font-medium">{products.description}</TableCell>
				<TableCell className="font-medium">{products.price}</TableCell>
				<TableCell className="font-medium">{products.stock}</TableCell>
				<TableCell className="font-medium">{products.categoryName}</TableCell>
				<TableCell className="flex items-center">
					<Button
						size="xs"
						className="mr-0.5 border-none"
						onClick={() => setIsStockEntryFormOpen(true)}
					>
						<PackagePlus className="h-4 w-4" />
					</Button>
					<Button
						size="xs"
						className="mr-0.5 border-none"
						onClick={() => {
							setIsProductFormOpen(true);
						}}
					>
						<PencilLine className="h-4 w-4" />
					</Button>
					<Button
						size="xs"
						className="mr-0.5 border-none"
						onClick={() => handleDeleteProduct(products.id)}
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</TableCell>
			</TableRow>
			<Dialog open={isProductFormOpen} onOpenChange={setIsProductFormOpen}>
				<ProductForm
					setIsProductFormOpen={setIsProductFormOpen}
					product={products}
				/>
			</Dialog>
			<Dialog open={stockEntryFormOpen} onOpenChange={setIsStockEntryFormOpen}>
				<StockEntryForm
					setIsStockEntryFormOpen={setIsStockEntryFormOpen}
					product={products}
				/>
			</Dialog>
		</>
	);
}
