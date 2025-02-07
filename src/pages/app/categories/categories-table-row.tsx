import { Search, Trash2 } from "lucide-react";

import { DeleteCategory } from "@/api/categories/delete-category";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { queryClient } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { CategoryForm } from "./category-form";

export interface CategoriesTableRowProps {
	categories: {
		id: string;
		name: string | null;
		createdAt: Date | null;
		updatedAt: Date | null;
		description: string | null;
		organizationId: string;
	};
}

export function CategoriesTablerRow({ categories }: CategoriesTableRowProps) {
	const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
	const { mutateAsync: deleteCategory } = useMutation({
		mutationFn: DeleteCategory,
	});

	async function handleDeleteCategory(id: string) {
		try {
			await deleteCategory({ id });

			toast.success("Categoria Deletado!");
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		} catch (err) {
			toast.error("Erro ao deletar o categoria");
		}
	}

	return (
		<>
			<TableRow>
				<TableCell className="font-medium">{categories.name}</TableCell>
				<TableCell className="font-medium">{categories.description}</TableCell>
				<TableCell className="flex items-center">
					<Button
						size="xs"
						className="mr-0.5 border-none"
						onClick={() => {
							setIsCategoryFormOpen(true);
						}}
					>
						<Search className="h-4 w-4" />
					</Button>
					<Button
						size="xs"
						className="mr-0.5 border-none"
						onClick={() => handleDeleteCategory(categories.id)}
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</TableCell>
			</TableRow>
			<Dialog open={isCategoryFormOpen} onOpenChange={setIsCategoryFormOpen}>
				<CategoryForm
					setIsCategoryFormOpen={setIsCategoryFormOpen}
					category={categories}
				/>
			</Dialog>
		</>
	);
}
