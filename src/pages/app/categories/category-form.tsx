import { Button } from "@/components/ui/button";
import {
	DialogContent,
	DialogFooter,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { CreateCategory } from "@/api/categories/create-category";
import { UpdateCategory } from "@/api/categories/update-category";
import { queryClient } from "@/lib/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export interface CategoryFormProps {
	setIsCategoryFormOpen: (isOpen: boolean) => void;
	category?: {
		id: string;
		name: string | null;
		createdAt: Date | null;
		updatedAt: Date | null;
		description: string | null;
		organizationId: string;
	};
}

const categorySchema = z.object({
	name: z.string().min(1, { message: "Este campo é obrigatório" }),
	description: z.string(),
});

type CategorySchema = z.infer<typeof categorySchema>;

export function CategoryForm({
	setIsCategoryFormOpen,
	category,
}: CategoryFormProps) {
	const {
		register,
		handleSubmit,
		formState: { isSubmitting, errors },
		reset,
	} = useForm<CategorySchema>({
		resolver: zodResolver(categorySchema),
		values: {
			name: category ? String(category?.name) : "",
			description: category ? String(category?.description) : "",
		},
	});

	const { mutateAsync: createCategory } = useMutation({
		mutationFn: CreateCategory,
	});

	const { mutateAsync: updateCategory } = useMutation({
		mutationFn: UpdateCategory,
	});

	async function handleCreateCategory({ name, description }: CategorySchema) {
		if (category) {
			try {
				await updateCategory({
					id: String(category?.id),
					name,
					description,
				});

				toast.success("Categoria Atualizada!");
				setIsCategoryFormOpen(false);
				reset();
				queryClient.invalidateQueries({ queryKey: ["categories"] });
			} catch (err) {
				toast.error("Erro ao atualizar a categoria");
			}
		} else {
			try {
				await createCategory({
					name,
					description,
				});

				toast.success("Categoria criada!");
				setIsCategoryFormOpen(false);
				reset();
				queryClient.invalidateQueries({ queryKey: ["categories"] });
			} catch (err) {
				toast.error("Erro ao adicionar item ao pedido");
			}
		}
	}

	return (
		<DialogContent className="min-w-96">
			<DialogTitle> </DialogTitle>
			<form
				id="order-item-form"
				onSubmit={handleSubmit(handleCreateCategory)}
				className="flex flex-col gap-1"
			>
				<div className="mb-6 flex flex-col w-full">
					<Label className="mb-2">Nome</Label>
					<Input
						id="name"
						type="text"
						autoCorrect="off"
						{...register("name")}
					/>
					{errors.name && (
						<span className="text-xs font-medium text-red-500 dark:text-red-400 absolute mt-16">
							{errors.name.message}
						</span>
					)}
				</div>
				<div className="mb-6 flex flex-col w-full">
					<Label className="mb-2">Descrição</Label>
					<Input
						id="description"
						type="text"
						autoCorrect="off"
						{...register("description")}
					/>
					{errors.description && (
						<span className="text-xs font-medium text-red-500 dark:text-red-400 absolute mt-16">
							{errors.description.message}
						</span>
					)}
				</div>

				<DialogFooter>
					<Button type="submit" disabled={isSubmitting} className="w-full">
						{isSubmitting ? (
							<Loader2 className="h-6 w-6 animate-spin text-gray-50" />
						) : category ? (
							<Label>Salvar</Label>
						) : (
							<Label>Adicionar</Label>
						)}
					</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	);
}
