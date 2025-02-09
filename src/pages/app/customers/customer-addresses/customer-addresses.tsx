import { getCustomerAddressesByCustomer } from "@/api/customers/customer-addresses/get-customers-addresses-by-customer";
import { getCustomers } from "@/api/customers/get-customers";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { CustomerAddressForm } from "./customer-address-form";
import { CustomerAddressTablerRow } from "./customer-address-table-row";
import { CustomerTableSkeleton } from "./customer-address-table-skeleton";

export function Customers() {
	const [isCustomerAddressFormOpen, setIsCustomerAddressFormOpen] =
		useState(false);

	const { data: customers, isLoading: isLoadingCustomerAddressesByCustomer } =
		useQuery({
			queryKey: ["customersAddressesByCustomer"],
			queryFn: () => getCustomerAddressesByCustomer(),
		});

	return (
		<>
			<Helmet title="Clientes" />
			<div className="flex flex-col gap-4">
				<h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
				<div className="flex items-center justify-between">
					<span> </span>
					<Button
						size="xs"
						className="mr-0.5 border-none"
						onClick={() => {
							setIsCustomerAddressFormOpen(true);
						}}
					>
						Novo
					</Button>
				</div>

				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[440px]">Nome</TableHead>
								<TableHead className="w-[240px]">Descrição</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{/* {isLoadingTransactions && <TransactionTableSkeleton />} */}
							{/* biome-ignore lint/complexity/useOptionalChain: <explanation> */}
							{customers &&
								customers.customers.map((customerAddress) => {
									return (
										<CustomerAddressTablerRow
											key={customerAddress.id}
											customerAddress={customerAddress}
										/>
									);
								})}
						</TableBody>
					</Table>
				</div>
				{isLoadingCustomers && <CustomerTableSkeleton />}

				<Dialog
					open={isCustomerAddressFormOpen}
					onOpenChange={setIsCustomerAddressFormOpen}
				>
					<CustomerAddressForm
						setIsCustomerAddressFormOpen={setIsCustomerAddressFormOpen}
					/>
				</Dialog>
			</div>
		</>
	);
}
