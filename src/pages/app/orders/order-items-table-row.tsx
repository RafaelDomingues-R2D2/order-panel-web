import { Search, Trash2 } from "lucide-react";

import { DeleteOrderItem } from "@/api/order-items/delete-order-item";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { queryClient } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { OrderItemForm } from "./order-item-form";

export interface OrderItemsTableRowProps {
	orderItem: {
		id: string;
		orderId: string;
		total: number | null;
		productId: string;
		quantity: number | null;
		productName: string;
	};
}

export function OrderItemsTablerRow({ orderItem }: OrderItemsTableRowProps) {
	const [isItemFormOpen, setIsItemFormOpen] = useState(false);

	const { mutateAsync: deleteOrderItem } = useMutation({
		mutationFn: DeleteOrderItem,
	});

	async function handleDeleteOrderItem(id: string) {
		try {
			await deleteOrderItem({ id });

			toast.success("Item Deletado!");
			queryClient.invalidateQueries({
				queryKey: ["orderItems", orderItem.orderId],
			});
			queryClient.invalidateQueries({ queryKey: ["orders"] });
		} catch (err) {
			toast.error("Erro ao deletar o item");
		}
	}

	return (
		<>
			<TableRow>
				<TableCell className="font-medium">{orderItem.productName}</TableCell>
				<TableCell className="font-medium">{orderItem.quantity}</TableCell>
				<TableCell>
					{(Number(orderItem.total) / 100).toLocaleString("pt-BR", {
						style: "currency",
						currency: "BRL",
					})}
				</TableCell>
				<TableCell className="flex items-center">
					<Button
						size="xs"
						className="mr-0.5 border-none"
						onClick={() => {
							setIsItemFormOpen(true);
						}}
					>
						<Search className="h-4 w-4" />
					</Button>
					<Button
						size="xs"
						className="mr-0.5 border-none"
						onClick={() => handleDeleteOrderItem(orderItem.id)}
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</TableCell>
			</TableRow>
			<Dialog open={isItemFormOpen} onOpenChange={setIsItemFormOpen}>
				<OrderItemForm
					setIsItemFormOpen={setIsItemFormOpen}
					orderId={orderItem.orderId}
					orderItemId={orderItem.id}
				/>
			</Dialog>
		</>
	);
}
