import { Button } from "@/components/ui/button";
import {
	DialogContent,
	DialogFooter,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { getCategories } from "@/api/categories/get-categories";
import { CreateProduct } from "@/api/products/create-product";
import { UpdateProduct } from "@/api/products/update-product";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

import { queryClient } from "@/lib/react-query";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";

export interface ProductFormProps {
	setIsProductFormOpen: (isOpen: boolean) => void;
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

const productSchema = z.object({
	name: z.string().min(1, { message: "Este campo é obrigatório" }),
	description: z.string(),
	price: z.string().min(1, { message: "Este campo é obrigatório" }),
	stock: z.string().min(1, { message: "Este campo é obrigatório" }),
	categoryId: z.string().min(1, { message: "Este campo é obrigatório" }),
});

type ProductSchema = z.infer<typeof productSchema>;

export function ProductForm({
	setIsProductFormOpen,
	product,
}: ProductFormProps) {
	const { data: categories } = useQuery({
		queryKey: ["categories"],
		queryFn: () => getCategories(),
	});
	const {
		register,
		handleSubmit,
		formState: { isSubmitting, errors },
		control,
		reset,
		setValue,
	} = useForm<ProductSchema>({
		resolver: zodResolver(productSchema),
		values: {
			name: product ? String(product?.name) : "",
			description: product ? String(product?.description) : "",
			price: product?.price ? String(product?.price) : "",
			stock: product?.stock ? String(product?.stock) : "",
			categoryId: product ? String(product?.categoryId) : "",
		},
	});

	const { mutateAsync: createProduct } = useMutation({
		mutationFn: CreateProduct,
	});

	const { mutateAsync: updateProduct } = useMutation({
		mutationFn: UpdateProduct,
	});

	async function handleCreateProduct({
		name,
		description,
		price,
		stock,
		categoryId,
	}: ProductSchema) {
		if (product) {
			try {
				await updateProduct({
					id: String(product?.id),
					name,
					description,
					price: Number(price),
					stock: Number(stock),
					categoryId,
				});

				toast.success("Produto Atualizada!");
				setIsProductFormOpen(false);
				reset();
				queryClient.invalidateQueries({ queryKey: ["products"] });
			} catch (err) {
				toast.error("Erro ao atualizar a produto");
			}
		} else {
			try {
				await createProduct({
					name,
					description,
					price: Number(price),
					stock: Number(stock),
					categoryId,
				});

				toast.success("Produto criada!");
				setIsProductFormOpen(false);
				reset();
				queryClient.invalidateQueries({ queryKey: ["products"] });
			} catch (err) {
				toast.error("Erro ao criar o produto");
			}
		}
	}

	return (
		<DialogContent className="min-w-96">
			<DialogTitle> </DialogTitle>
			<form
				onSubmit={handleSubmit(handleCreateProduct)}
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
				<div className="mb-6 flex flex-col w-full">
					<Label className="mb-2">Categorias</Label>
					<Controller
						name="categoryId"
						control={control}
						render={({ field: { value } }) => (
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										// biome-ignore lint/a11y/useSemanticElements: <explanation>
										role="combobox"
										className="w-auto justify-between"
									>
										{value
											? categories?.categories.find(
													(category) => category.id === value,
												)?.name
											: "Categorias"}
										<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-[200px] p-0">
									<Command>
										<CommandInput placeholder="Procurar..." />
										<CommandList>
											<CommandEmpty>Nada por aqui...</CommandEmpty>
											<CommandGroup>
												{categories?.categories.map((category) => (
													<CommandItem
														key={category.id}
														value={category.name}
														onSelect={(currentValue) => {
															setValue(
																"categoryId",
																categories.categories.find(
																	(f) =>
																		f.name.toLowerCase() ===
																		currentValue.toLowerCase(),
																)?.id || "",
															);
														}}
													>
														<Check
															className={cn(
																"mr-2 h-4 w-4",
																value === category.id
																	? "opacity-100"
																	: "opacity-0",
															)}
														/>
														{category.name}
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
						)}
					/>
					{errors.categoryId && (
						<span className="text-xs font-medium text-red-500 dark:text-red-400 absolute mt-16">
							{errors.categoryId.message}
						</span>
					)}
				</div>
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
				<div className="mb-6 flex flex-col w-full">
					<Label className="mb-2">Valor</Label>
					<Controller
						name="price"
						control={control}
						render={({ field: { onChange, onBlur, value } }) => (
							<NumericFormat
								placeholder="R$ 00,00"
								thousandSeparator="."
								decimalSeparator=","
								fixedDecimalScale
								decimalScale={2}
								prefix="R$ "
								value={value}
								onValueChange={(values) => onChange(values.value)}
								onBlur={onBlur}
								className="'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							/>
						)}
					/>

					{errors.price && (
						<span className="text-xs font-medium text-red-500 dark:text-red-400 absolute mt-16">
							{errors.price.message}
						</span>
					)}
				</div>

				<DialogFooter>
					<Button type="submit" disabled={isSubmitting} className="w-full">
						{isSubmitting ? (
							<Loader2 className="h-6 w-6 animate-spin text-gray-50" />
						) : product ? (
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
