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
import { CustomerForm } from "./customer-form";
import { CustomersTablerRow } from "./customers-table-row";

export function Customers() {
	const [isCustomerFormOpen, setIsCustomerFormOpen] = useState(false);

	const { data: customers } = useQuery({
		queryKey: ["customers"],
		queryFn: () => getCustomers(),
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
							setIsCustomerFormOpen(true);
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
								customers.customers.map((customer) => {
									return (
										<CustomersTablerRow
											key={customer.id}
											customers={customer}
										/>
									);
								})}
						</TableBody>
					</Table>
				</div>
				<Dialog open={isCustomerFormOpen} onOpenChange={setIsCustomerFormOpen}>
					<CustomerForm setIsCustomerFormOpen={setIsCustomerFormOpen} />
				</Dialog>
			</div>
		</>
	);
}
