import { CreateOrderItem } from "@/api/order-items/create-order-item";
import { UpdateOrderItem } from "@/api/order-items/update-order-item";
import { getProducts } from "@/api/products/get-products";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	DialogContent,
	DialogFooter,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

export interface OrderItemFormProps {
	setIsItemFormOpen: (isOpen: boolean) => void;
	orderItem?: {
		id: string;
		orderId: string;
		total: number | null;
		productId: string;
		quantity: number | null;
		productName: string;
	};
}

const orderItemSchema = z.object({
	orderId: z.string(),
	productId: z.string().min(1, { message: "Este campo é obrigatório" }),
	quantity: z.string().min(1, { message: "Este campo é obrigatório" }),
});

type OrderItemSchema = z.infer<typeof orderItemSchema>;

export function OrderItemForm({
	setIsItemFormOpen,
	orderItem,
}: OrderItemFormProps) {
	const [searchParams] = useSearchParams();

	const orderId = searchParams.get("orderId");

	const { data: products } = useQuery({
		queryKey: ["products"],
		queryFn: () => getProducts(),
	});

	const {
		register,
		handleSubmit,
		control,
		formState: { isSubmitting, errors },
		reset,
		setValue,
	} = useForm<OrderItemSchema>({
		resolver: zodResolver(orderItemSchema),
		values: {
			orderId: orderItem?.id ? String(orderItem?.orderId) : "",
			productId: orderItem?.id ? String(orderItem?.productId) : "",
			quantity: orderItem?.id ? String(orderItem?.quantity) : "",
		},
	});

	const { mutateAsync: createOrderItem } = useMutation({
		mutationFn: CreateOrderItem,
	});

	const { mutateAsync: updateOrderItem } = useMutation({
		mutationFn: UpdateOrderItem,
	});

	async function handleCreateOrderItem({
		productId,
		quantity,
	}: OrderItemSchema) {
		if (orderItem?.id) {
			try {
				await updateOrderItem({
					id: String(orderItem?.id),
					productId,
					quantity: Number(quantity),
				});

				toast.success("Item Atualizado!");
				setIsItemFormOpen(false);
				reset();
				queryClient.invalidateQueries({ queryKey: ["orderItems", orderId] });
				queryClient.invalidateQueries({
					queryKey: ["orderItem", orderItem?.id],
				});
				queryClient.invalidateQueries({ queryKey: ["orders"] });
			} catch (err) {
				toast.error("Erro ao atualizar item ao pedido");
			}
		} else {
			try {
				await createOrderItem({
					orderId: String(orderId),
					productId,
					quantity: Number(quantity),
				});

				toast.success("Item adicionado ao pedido!");
				setIsItemFormOpen(false);
				reset();
				queryClient.invalidateQueries({ queryKey: ["orderItems", orderId] });
				queryClient.invalidateQueries({ queryKey: ["orders"] });
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
				onSubmit={handleSubmit(handleCreateOrderItem)}
				className="flex flex-col gap-1"
			>
				<div className="mb-6 flex flex-col ml-2">
					<Label className="mb-2">Produtos</Label>
					<Controller
						name="productId"
						control={control}
						render={({ field: { value } }) => (
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										// biome-ignore lint/a11y/useSemanticElements: <explanation>
										role="combobox"
										className="w-auto justify-between"
										// biome-ignore lint/complexity/noUselessTernary: <explanation>
										disabled={orderItem?.id ? true : false}
									>
										{value
											? `${
													products?.products.find(
														(customer) => customer.id === value,
													)?.name
												} - Est: ${
													products?.products.find(
														(customer) => customer.id === value,
													)?.stock
												} - Pre: ${
													products?.products.find(
														(customer) => customer.id === value,
													)?.price
												}`
											: "Produtos"}
										<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-80 p-0">
									<Command>
										<CommandInput placeholder="Procurar..." />
										<CommandList>
											<CommandEmpty>Nada por aqui...</CommandEmpty>
											<CommandGroup>
												{products?.products.map((product) => (
													<CommandItem
														key={product.id}
														value={product.name}
														onSelect={(currentValue) => {
															setValue(
																"productId",
																products.products.find(
																	(f) =>
																		f.name.toLowerCase() ===
																		currentValue.toLowerCase().split(" - ")[0],
																)?.id || "",
															);
														}}
													>
														{`${product.name} - Est: ${product.stock} - Pre:${product.price} `}
														<Check
															className={cn(
																"mr-2 h-4 w-4",
																value === product.id
																	? "opacity-100"
																	: "opacity-0",
															)}
														/>
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
						)}
					/>
					{errors.productId && (
						<span className="text-xs font-medium text-red-500 dark:text-red-400 absolute mt-16">
							{errors.productId.message}
						</span>
					)}
				</div>
				<div className="mb-6 flex flex-col ml-2">
					<Label className="mb-2">Quantidade</Label>
					<Input
						id="quantity"
						type="number"
						autoCorrect="off"
						// biome-ignore lint/complexity/noUselessTernary: <explanation>
						disabled={orderItem?.id ? true : false}
						{...register("quantity")}
					/>
					{errors.quantity && (
						<span className="text-xs font-medium text-red-500 dark:text-red-400 absolute mt-16">
							{errors.quantity.message}
						</span>
					)}
				</div>

				<DialogFooter>
					<Button type="submit" disabled={isSubmitting} className="w-full">
						{isSubmitting ? (
							<Loader2 className="h-6 w-6 animate-spin text-gray-50" />
						) : orderItem?.id ? (
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
