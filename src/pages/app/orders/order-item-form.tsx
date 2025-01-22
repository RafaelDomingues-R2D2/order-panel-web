import { CreateOrderItem } from "@/api/order-items/create-order-item";
import { getOrderItem } from "@/api/order-items/get-order-item";
import { UpdateOrderItem } from "@/api/order-items/update-order-item";
import { getProducts } from "@/api/products/get-products";
import { Button } from "@/components/ui/button";
import {
	DialogContent,
	DialogFooter,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { queryClient } from "@/lib/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export interface OrderItemFormProps {
	setIsItemFormOpen: (isOpen: boolean) => void;
	orderId?: string;
	orderItemId?: string;
}

const orderItemSchema = z.object({
	orderId: z.string(),
	productId: z.string(),
	quantity: z.string(),
});

type OrderItemSchema = z.infer<typeof orderItemSchema>;

export function OrderItemForm({
	setIsItemFormOpen,
	orderId,
	orderItemId,
}: OrderItemFormProps) {
	const { data: products } = useQuery({
		queryKey: ["products"],
		queryFn: () => getProducts(),
	});

	const { data: orderItem } = useQuery({
		queryKey: ["orderItem", orderItemId],
		queryFn: () => getOrderItem({ id: String(orderItemId) }),
		enabled: orderItemId !== "new",
	});

	const {
		register,
		handleSubmit,
		control,
		formState: { isSubmitting, errors },
		reset,
	} = useForm<OrderItemSchema>({
		resolver: zodResolver(orderItemSchema),
		values: {
			orderId:
				orderItemId !== "new" ? String(orderItem?.orderItem?.orderId) : "",
			productId:
				orderItemId !== "new" ? String(orderItem?.orderItem?.productId) : "",
			quantity:
				orderItemId !== "new" ? String(orderItem?.orderItem?.quantity) : "",
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
		if (orderItemId !== "new") {
			try {
				await updateOrderItem({
					id: String(orderItemId),
					productId,
					quantity: Number(quantity),
				});

				toast.success("Item Atualizado!");
				setIsItemFormOpen(false);
				reset();
				queryClient.invalidateQueries({ queryKey: ["orderItems", orderId] });
				queryClient.invalidateQueries({
					queryKey: ["orderItem", orderItemId],
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
			{/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
			<DialogTitle></DialogTitle>
			<form
				id="order-item-form"
				onSubmit={handleSubmit(handleCreateOrderItem)}
				className="flex flex-col gap-1"
			>
				<div className="flex items-center">
					<div className="mb-6 flex flex-col w-full">
						<Label className="mb-2">Produtos</Label>
						<Controller
							name="productId"
							control={control}
							render={({ field: { name, onChange, value, disabled } }) => {
								return (
									<>
										<Select
											name={name}
											onValueChange={onChange}
											value={value}
											disabled={disabled}
										>
											<SelectTrigger>
												<SelectValue placeholder="Produto" />
											</SelectTrigger>
											<SelectContent>
												{/* biome-ignore lint/complexity/useOptionalChain: <explanation> */}
												{products &&
													products?.products?.map((product) => {
														return (
															<SelectItem key={product.id} value={product.id}>
																<span>{`Nam: ${product.name} - Est: ${product.stock} - Pre: ${(
																	Number(product.price) / 100
																).toLocaleString("pt-BR", {
																	style: "currency",
																	currency: "BRL",
																})}`}</span>
															</SelectItem>
														);
													})}
											</SelectContent>
										</Select>
										{errors.productId && (
											<span className="text-xs font-medium text-red-500 dark:text-red-400 absolute mt-16">
												{errors.productId.message}
											</span>
										)}
									</>
								);
							}}
						/>
					</div>
					<div className="mb-6 flex flex-col ml-2">
						<Label className="mb-2">Quantidade</Label>
						<Input
							id="quantity"
							type="number"
							autoCorrect="off"
							{...register("quantity")}
						/>
						{errors.quantity && (
							<span className="text-xs font-medium text-red-500 dark:text-red-400 absolute mt-16">
								{errors.quantity.message}
							</span>
						)}
					</div>
				</div>

				<DialogFooter>
					<Button type="submit" disabled={isSubmitting} className="w-full">
						{isSubmitting ? (
							<Loader2 className="h-6 w-6 animate-spin text-gray-50" />
						) : orderItemId !== "new" ? (
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
