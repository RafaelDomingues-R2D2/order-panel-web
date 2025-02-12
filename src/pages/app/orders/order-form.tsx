import { getCustomers } from "@/api/customers/get-customers";
import { getOrderItems } from "@/api/order-items/get-order-items";
import { CreateOrder } from "@/api/orders/create-order";
import { getOrder } from "@/api/orders/get-order";
import { UpdateOrder } from "@/api/orders/update-order";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { DatePicker } from "@/components/ui/date-picker";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

import { Checkbox } from "@/components/ui/checkbox";
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { queryClient } from "@/lib/react-query";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
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
	customerId: z.string().min(1, { message: "Este campo é obrigatório" }),
	deliveryDate: z.string().min(1, { message: "Este campo é obrigatório" }),
	pickupeByCustomer: z.boolean(),
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
		values: {
			customerId: orderId !== "new" ? String(order?.order?.customerId) : "",
			deliveryDate:
				orderId !== "new"
					? String(order?.order?.deliveryDate)
					: format(new Date(), "yyyy-MM-dd"),
			pickupeByCustomer:
				orderId !== "new" ? Boolean(order?.order?.pickupeByCustomer) : false,
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

	async function handleCreateOrder({
		customerId,
		deliveryDate,
		pickupeByCustomer,
	}: OrderSchema) {
		if (id !== "new") {
			console.log("customerId ", customerId);
			try {
				await updateOrder({
					id,
					customerId,
					deliveryDate,
					pickupeByCustomer,
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
					pickupeByCustomer,
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
			<DialogTitle> </DialogTitle>
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
												? customers?.customers.find(
														(customer) => customer.id === value,
													)?.name
												: "Clientes"}
											<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-[200px] p-0">
										<Command>
											<CommandInput placeholder="Procurar..." />
											<CommandList>
												<CommandEmpty>Nada por aqui...</CommandEmpty>
												<CommandGroup>
													{customers?.customers.map((customer) => (
														<CommandItem
															key={customer.id}
															value={customer.name}
															onSelect={(currentValue) => {
																setValue(
																	"customerId",
																	customers.customers.find(
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
																	value === customer.id
																		? "opacity-100"
																		: "opacity-0",
																)}
															/>
															{customer.name}
														</CommandItem>
													))}
												</CommandGroup>
											</CommandList>
										</Command>
									</PopoverContent>
								</Popover>
							)}
						/>
						{errors.customerId && (
							<span className="text-xs font-medium text-red-500 dark:text-red-400 absolute mt-16">
								{errors.customerId.message}
							</span>
						)}
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
					<Controller
						name="pickupeByCustomer"
						control={control}
						defaultValue={false}
						render={({ field: { value, onChange } }) => (
							<div className="mb-6 ml-1 flex flex-col w-full">
								<Checkbox
									id="pickupeByCustomer"
									checked={value}
									onCheckedChange={onChange}
								/>
								<label
									htmlFor="pickupeByCustomer"
									className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
								>
									Retirada pelo Cliente
								</label>
							</div>
						)}
					/>
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
			{id !== "new" && (
				<>
					<span className="text-1xl font-bold tracking-tight">Itens</span>
					<div className="flex items-center justify-between">
						<span> </span>
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
