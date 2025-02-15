import { changeOrderStage } from "@/api/orders/change-order-stage";
import { type Task, getOrders } from "@/api/orders/get-orders";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import {
	DragDropContext,
	Draggable,
	type DropResult,
	Droppable,
} from "@hello-pangea/dnd";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { OrdersTableSkeleton } from "./card-skeleton";
import { OrderForm } from "./order-form";
import { TaskCard } from "./task-card";

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

	const { data: orders, isLoading: isLoadingOrders } = useQuery({
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
										{tasks[columnId as keyof Columns].map((task, index) => {
											return (
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
															<TaskCard task={task} index={index} />
														</Card>
													)}
												</Draggable>
											);
										})}
										{provided?.placeholder}
									</Card>
								)}
							</Droppable>
						))}
					</div>
				</DragDropContext>
			</div>
			<Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
				<OrderForm setIsFormOpen={setIsFormOpen} />
			</Dialog>
			{isLoadingOrders && <OrdersTableSkeleton />}
		</>
	);
}
