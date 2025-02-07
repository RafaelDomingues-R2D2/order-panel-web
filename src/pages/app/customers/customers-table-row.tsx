import { Search, Trash2 } from "lucide-react";

import { DeleteCustomer } from "@/api/customers/delete-customer";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { queryClient } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { CustomerForm } from "./customer-form";

export interface CustomersTableRowProps {
	customers: {
		id: string;
		organizationId: string;
		name: string;
		email: string;
		phone: string | null;
	};
}

export function CustomersTablerRow({ customers }: CustomersTableRowProps) {
	const [isCustomerFormOpen, setIsCustomerFormOpen] = useState(false);
	const { mutateAsync: deleteCustomer } = useMutation({
		mutationFn: DeleteCustomer,
	});

	async function handleDeleteCustomer(id: string) {
		try {
			await deleteCustomer({ id });

			toast.success("Cliente Deletado!");
			queryClient.invalidateQueries({ queryKey: ["customers"] });
		} catch (err) {
			toast.error("Erro ao deletar o cliente");
		}
	}

	return (
		<>
			<TableRow>
				<TableCell className="font-medium">{customers.name}</TableCell>
				<TableCell className="font-medium">{customers.email}</TableCell>
				<TableCell className="font-medium">{customers.phone}</TableCell>
				<TableCell className="flex items-center">
					<Button
						size="xs"
						className="mr-0.5 border-none"
						onClick={() => {
							setIsCustomerFormOpen(true);
						}}
					>
						<Search className="h-4 w-4" />
					</Button>
					<Button
						size="xs"
						className="mr-0.5 border-none"
						onClick={() => handleDeleteCustomer(customers.id)}
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</TableCell>
			</TableRow>
			<Dialog open={isCustomerFormOpen} onOpenChange={setIsCustomerFormOpen}>
				<CustomerForm
					setIsCustomerFormOpen={setIsCustomerFormOpen}
					customer={customers}
				/>
			</Dialog>
		</>
	);
}
