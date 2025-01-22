import { getCustomers } from "@/api/cutomers/get-customers";
import { getOrderItems } from "@/api/order-items/get-order-items";
import { CreateOrder } from "@/api/orders/create-order";
import { getOrder } from "@/api/orders/get-order";
import { UpdateOrder } from "@/api/orders/update-order";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { queryClient } from "@/lib/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { OrderItemForm } from "./order-item-form";
import { OrderItemsTablerRow } from "./order-items-table-row";

export interface OrderFormProps {
	setIsFormOpen: (isOpen: boolean) => void;
	orderId: string;
}

const orderSchema = z.object({
	customerId: z.string(),
	deliveryDate: z.string(),
});

type OrderSchema = z.infer<typeof orderSchema>;

export function OrderForm({ orderId, setIsFormOpen }: OrderFormProps) {
	const [isItemFormOpen, setIsItemFormOpen] = useState(false);
	const [id, setId] = useState(orderId);

	const { data: orderItems } = useQuery({
		queryKey: ["orderItems", id],
		queryFn: () => getOrderItems({ orderId: id }),
		enabled: id !== "new",
	});

	const { data: order, isFetched } = useQuery({
		queryKey: ["order", orderId],
		queryFn: () => getOrder({ id: orderId }),
		enabled: orderId !== "new",
	});

	const { data: customers } = useQuery({
		queryKey: ["customers"],
		queryFn: () => getCustomers(),
	});

	const {
		handleSubmit,
		control,
		formState: { isSubmitting, errors },
		setValue,
	} = useForm<OrderSchema>({
		resolver: zodResolver(orderSchema),
		defaultValues: {
			customerId: orderId !== "new" ? String(order?.order?.customerId) : "",
			deliveryDate:
				orderId !== "new"
					? String(order?.order?.deliveryDate)
					: format(new Date(), "yyyy-MM-dd"),
		},
	});

	const { mutateAsync: createOrder } = useMutation({
		mutationFn: CreateOrder,
		onSuccess(order) {
			setId(order?.data?.order?.id);
		},
	});

	const { mutateAsync: updateOrder } = useMutation({
		mutationFn: UpdateOrder,
	});

	async function handleCreateOrder({ customerId, deliveryDate }: OrderSchema) {
		if (id !== "new") {
			try {
				await updateOrder({
					id,
					customerId,
					deliveryDate,
				});

				queryClient.invalidateQueries({ queryKey: ["orders"] });
				queryClient.invalidateQueries({ queryKey: ["order", orderId] });
				setIsFormOpen(false);
				toast.success("Pedido Atualizado!");
			} catch (err) {
				toast.error("Erro ao atualizar o pedido");
			}
		} else {
			try {
				await createOrder({
					customerId,
					deliveryDate,
				});

				toast.success("Pedido criado!");
				setIsItemFormOpen(true);
				queryClient.invalidateQueries({ queryKey: ["orders"] });
			} catch (err) {
				toast.error("Erro ao criar o pedido");
			}
		}
	}

	const handleDateChange = (selectedDate: Date | undefined) => {
		if (selectedDate) {
			setValue("deliveryDate", format(selectedDate, "yyyy-MM-dd"));
		}
	};

	useEffect(() => {
		setId(orderId);
	}, [orderId]);

	return (
		<DialogContent className="min-w-96">
			{/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
			<DialogTitle></DialogTitle>
			<form
				onSubmit={handleSubmit(handleCreateOrder)}
				className="flex flex-col gap-1"
			>
				<div className="flex items-center">
					<div className="mb-6 flex flex-col w-full">
						<Label className="mb-2">Clientes</Label>
						<Controller
							name="customerId"
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
												<SelectValue placeholder="Cliente" />
											</SelectTrigger>
											<SelectContent>
												{/* biome-ignore lint/complexity/useOptionalChain: <explanation> */}
												{customers &&
													customers?.customers?.map((customer) => {
														return (
															<SelectItem key={customer?.id} value={customer?.id}>
																<span>{customer?.name}</span>
															</SelectItem>
														);
													})}
											</SelectContent>
										</Select>
										{errors?.customerId && (
											<span className="text-xs font-medium text-red-500 dark:text-red-400 absolute mt-16">
												{errors?.customerId?.message}
											</span>
										)}
									</>
								);
							}}
						/>
					</div>
					{orderId !== "new" ? (
						isFetched && (
							<div className="mb-6 ml-1 flex flex-col w-full">
								<Label className="mb-2">Data</Label>
								<DatePicker
									onSelectDate={handleDateChange}
									inputDate={parseISO(order?.order?.deliveryDate ?? "")}
								/>
							</div>
						)
					) : (
						<div className="mb-6 ml-1 flex flex-col w-full">
							<Label className="mb-2">Data</Label>
							<DatePicker onSelectDate={handleDateChange} today={true} />
						</div>
					)}
				</div>

				<DialogFooter>
					<Button type="submit" disabled={isSubmitting} className="w-full">
						{isSubmitting ? (
							<Loader2 className="h-6 w-6 animate-spin text-gray-50" />
						) : id !== "new" ? (
							<Label>Salvar</Label>
						) : (
							<Label>Criar</Label>
						)}
					</Button>
				</DialogFooter>
			</form>

			{orderItems && id !== "new" && (
				<>
					<div className="space-y-2.5 mb-1">
						<h2>Itens</h2>

						<Button
							size="xs"
							className="mr-0.5 border-none"
							onClick={() => {
								setIsItemFormOpen(true);
							}}
						>
							Adicionar Item
						</Button>
					</div>

					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-[240px]">Nome</TableHead>
									<TableHead className="w-[140px]">Quantidade</TableHead>
									<TableHead className="w-[240px]">Total</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{/* {isLoadingTransactions && <TransactionTableSkeleton />} */}
								{/* biome-ignore lint/complexity/useOptionalChain: <explanation> */}
								{orderItems &&
									orderItems.orderItems.map((orderItem) => {
										return (
											<OrderItemsTablerRow
												key={orderItem.id}
												orderItem={orderItem}
											/>
										);
									})}
							</TableBody>
						</Table>
					</div>
					<Dialog open={isItemFormOpen} onOpenChange={setIsItemFormOpen}>
						<OrderItemForm
							setIsItemFormOpen={setIsItemFormOpen}
							orderId={id}
							orderItemId={"new"}
						/>
					</Dialog>
				</>
			)}
		</DialogContent>
	);
}
