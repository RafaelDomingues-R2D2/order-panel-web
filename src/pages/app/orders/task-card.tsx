import { DeleteOrder } from "@/api/orders/delete-order";
import type { Task } from "@/api/orders/get-orders";
import { Button } from "@/components/ui/button";
import { CardContent, CardTitle } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { queryClient } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { add, format } from "date-fns";
import { PencilLine, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { OrderForm } from "./order-form";
interface OrderKanbanProps {
	task: Task;
	index: number;
}

export function TaskCard({ task }: OrderKanbanProps) {
	const [isFormOpen, setIsFormOpen] = useState(false);

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

	return (
		<>
			<CardTitle className="text-center ">
				<p>{task?.customerName}</p>
			</CardTitle>
			<CardContent className="flex-col justify-between items-center text-center">
				<p className="mb-4 text-sm">{task?.customerPhone}</p>

				{task?.pickupeByCustomer ? (
					<p className="mb-4 text-sm">Cliente vai retirar</p>
				) : (
					<>
						<p className="text-sm">
							{`${task?.customerStreet} - ${task?.customerNumber}`}
						</p>
						<p className="mb-4 text-sm">
							{`${task?.customerNeighborhood} - ${task?.customerCity}`}
						</p>
					</>
				)}

				<p>{format(add(task?.deliveryDate, { hours: 3 }), "dd/MM/yyyy")}</p>
				<p>{task?.totalItems} - Itens</p>
				<p>
					{/* biome-ignore lint/style/noNonNullAssertion: <explanation> */}
					{(task?.totalAmount! / 100).toLocaleString("pt-BR", {
						style: "currency",
						currency: "BRL",
					})}
				</p>
				<div className="space-y-2.5">
					<Button
						size="xs"
						className="mr-0.5 border-none"
						onClick={() => {
							setIsFormOpen(true);
						}}
					>
						<PencilLine className="h-4 w-4" />
					</Button>
					<Button
						size="xs"
						className="mr-0.5 border-none"
						onClick={() => handleDeleteOrder(task?.id)}
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>
			</CardContent>

			<Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
				<OrderForm setIsFormOpen={setIsFormOpen} order={task} />
			</Dialog>
		</>
	);
}
