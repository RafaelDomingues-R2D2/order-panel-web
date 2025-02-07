import { changeOrderStage } from "@/api/orders/change-order-stage";
import { DeleteOrder } from "@/api/orders/delete-order";
import { type Task, getOrders } from "@/api/orders/get-orders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { queryClient } from "@/lib/react-query";
import {
	DragDropContext,
	Draggable,
	type DropResult,
	Droppable,
} from "@hello-pangea/dnd";
import { useMutation, useQuery } from "@tanstack/react-query";
import { add, format } from "date-fns";
import { Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import { OrderForm } from "./order-form";

interface Columns {
	TODO: Task[];
	DOING: Task[];
	DONE: Task[];
}

const columsLabel = {
	TODO: "A FAZER",
	DOING: "FAZENDO",
	DONE: "FEITO",
};

export function Orders() {
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [orderId, setOrderId] = useState("new");

	const { data: orders } = useQuery({
		queryKey: ["orders"],
		queryFn: getOrders,
	});

	const { mutateAsync: changeOrderStageFn } = useMutation({
		mutationFn: changeOrderStage,
	});

	const [tasks, setTasks] = useState<Columns>(
		(orders as Columns) ?? { TODO: [], DOING: [], DONE: [] },
	);

	const onDragEnd = (result: DropResult): void => {
		const { draggableId, source, destination } = result;

		if (!destination) return;

		if (
			source.droppableId === destination.droppableId &&
			source.index === destination.index
		) {
			return;
		}

		const startColumn = tasks[source.droppableId as keyof Columns];
		const endColumn = tasks[destination.droppableId as keyof Columns];
		const [movedTask] = startColumn.splice(source.index, 1);
		endColumn.splice(destination.index, 0, movedTask);

		setTasks({
			...tasks,
			[source.droppableId as keyof Columns]: startColumn,
			[destination.droppableId as keyof Columns]: endColumn,
		});

		changeOrderStageFn({ id: draggableId, stage: destination.droppableId });
	};

	const { mutateAsync: deleteOrder } = useMutation({
		mutationFn: DeleteOrder,
	});

	async function handleDeleteOrder(id: string) {
		try {
			await deleteOrder({ id });

			toast.success("Pedido Deletado!");
			queryClient.invalidateQueries({ queryKey: ["orders"] });
		} catch (err) {
			toast.error("Erro ao deletar o pedido");
		}
	}

	useEffect(() => {
		if (orders) {
			setTasks(orders as Columns);
		}
	}, [orders]);

	return (
		<>
			<Helmet title="Pedidos" />
			<div className="flex flex-col gap-4">
				<h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>
				<div className="flex items-center justify-between">
					<span> </span>
					<Button
						size="xs"
						className="mr-0.5 border-none"
						onClick={() => {
							setIsFormOpen(true);
							setOrderId("new");
						}}
					>
						Novo
					</Button>
				</div>
				<DragDropContext onDragEnd={onDragEnd}>
					<div className="flex justify-between space-x-4">
						{["TODO", "DOING", "DONE"].map((columnId) => (
							<Droppable droppableId={columnId} key={columnId}>
								{(provided) => (
									<Card
										ref={provided.innerRef}
										{...provided.droppableProps}
										className={
											"w-screen p-4 rounded-lg shadow-md min-h-[200px] transition-colors duration-300"
										}
									>
										<h2 className="text-xl font-semibold mb-4">
											{columsLabel[columnId as keyof Columns]}
										</h2>
										{tasks[columnId as keyof Columns].map((task, index) => (
											<Draggable
												draggableId={task.id}
												index={index}
												key={task.id}
											>
												{(provided, snapshot) => (
													<Card
														ref={provided.innerRef}
														{...provided.draggableProps}
														{...provided.dragHandleProps}
														className={`p-4 mb-3 rounded-lg shadow-sm transition-transform ${
															snapshot.isDragging ? "scale-105" : "scale-100"
														}`}
													>
														<CardTitle className="text-center ">
															<p>{task?.customerName}</p>
														</CardTitle>
														<CardContent className="flex-col justify-between items-center text-center">
															<p className="mb-4 text-sm">
																{task?.customerPhone}
															</p>
															<p>
																{format(
																	add(task?.deliveryDate, { hours: 3 }),
																	"dd/MM/yyyy",
																)}
															</p>
															<p>{task?.totalItems} - Itens</p>
															<p>
																{/* biome-ignore lint/style/noNonNullAssertion: <explanation> */}
																{(task.totalAmount! / 100).toLocaleString(
																	"pt-BR",
																	{
																		style: "currency",
																		currency: "BRL",
																	},
																)}
															</p>
															<div className="space-y-2.5">
																<Button
																	size="xs"
																	className="mr-0.5 border-none"
																	onClick={() => {
																		setIsFormOpen(true);
																		setOrderId(task.id);
																	}}
																>
																	<Search className="h-4 w-4" />
																</Button>
																<Button
																	size="xs"
																	className="mr-0.5 border-none"
																	onClick={() => handleDeleteOrder(task.id)}
																>
																	<Trash2 className="h-4 w-4" />
																</Button>
															</div>
														</CardContent>
													</Card>
												)}
											</Draggable>
										))}
										{provided.placeholder}
									</Card>
								)}
							</Droppable>
						))}
					</div>
				</DragDropContext>
			</div>
			<Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
				<OrderForm setIsFormOpen={setIsFormOpen} orderId={orderId} />
			</Dialog>
		</>
	);
}
