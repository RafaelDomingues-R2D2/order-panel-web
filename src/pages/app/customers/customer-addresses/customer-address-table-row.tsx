import { PencilLine, Trash2 } from "lucide-react";

import { DeleteCustomerAddress } from "@/api/customers/customer-addresses/delete-customer-address";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { queryClient } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { CustomerAddressForm } from "./customer-address-form";

export interface CustomersTableRowProps {
	customerAddress?: {
		id: string;
		customerId: string;
		street: string | null;
		number: string | null;
		neighborhood: string | null;
		city: string | null;
		state: string | null;
		postalCode: string | null;
	};
}

export function CustomerAddressTablerRow({
	customerAddress,
}: CustomersTableRowProps) {
	const [, setSearchParams] = useSearchParams();

	const [isCustomerAddressFormOpen, setIsCustomerAddressFormOpen] =
		useState(false);
	const { mutateAsync: deleteCustomerAddress } = useMutation({
		mutationFn: DeleteCustomerAddress,
	});

	async function handleDeleteCustomerAddress(id: string) {
		try {
			await deleteCustomerAddress({ id });

			toast.success("Endereço Deletado!");
			queryClient.invalidateQueries({
				queryKey: ["customerAddresses", customerAddress?.customerId],
			});
		} catch (err) {
			toast.error("Erro ao deletar o cliente");
		}
	}

	return (
		<>
			<TableRow>
				<TableCell className="font-medium">{customerAddress?.street}</TableCell>
				<TableCell className="font-medium">{customerAddress?.number}</TableCell>
				<TableCell className="font-medium">{customerAddress?.city}</TableCell>

				<TableCell className="flex items-center">
					<Button
						size="xs"
						className="mr-0.5 border-none"
						onClick={() => {
							setSearchParams((state) => {
								state.set("customerId", String(customerAddress?.customerId));

								return state;
							});
							setIsCustomerAddressFormOpen(true);
						}}
					>
						<PencilLine className="h-4 w-4" />
					</Button>
					<Button
						size="xs"
						className="mr-0.5 border-none"
						onClick={() => {
							setSearchParams((state) => {
								state.set("customerId", String(customerAddress?.customerId));

								return state;
							});
							handleDeleteCustomerAddress(String(customerAddress?.id));
						}}
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</TableCell>
			</TableRow>
			<Dialog
				open={isCustomerAddressFormOpen}
				onOpenChange={setIsCustomerAddressFormOpen}
			>
				<CustomerAddressForm
					setIsCustomerAddressFormOpen={setIsCustomerAddressFormOpen}
					customerAddress={customerAddress}
				/>
			</Dialog>
		</>
	);
}
