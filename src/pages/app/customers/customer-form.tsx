import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { CreateCustomer } from "@/api/customers/create-customer";
import { getCustomerAddressesByCustomer } from "@/api/customers/customer-addresses/get-customers-addresses-by-customer";
import { UpdateCustomer } from "@/api/customers/update-customer";
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
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { CustomerAddressForm } from "./customer-addresses/customer-address-form";
import { CustomerAddressTablerRow } from "./customer-addresses/customer-address-table-row";

export interface CustomerFormProps {
	setIsCustomerFormOpen: (isOpen: boolean) => void;
	customer?: {
		id: string;
		organizationId: string;
		name: string;
		email: string;
		phone: string | null;
	};
}

const customerSchema = z.object({
	name: z.string().min(1, { message: "Este campo é obrigatório" }),
	email: z.string(),
	phone: z.string(),
});

type CustomerSchema = z.infer<typeof customerSchema>;

export function CustomerForm({
	setIsCustomerFormOpen,
	customer,
}: CustomerFormProps) {
	const [isCustomerAddressFormOpen, setIsCustomerAddressFormOpen] =
		useState(false);
	const [, setSearchParams] = useSearchParams();

	const { data: customerAddresses } = useQuery({
		queryKey: ["customerAddresses", customer?.id],
		queryFn: () =>
			getCustomerAddressesByCustomer({ customerId: String(customer?.id) }),
		// biome-ignore lint/complexity/noUselessTernary: <explanation>
		enabled: customer?.id ? true : false,
	});

	const {
		register,
		handleSubmit,
		formState: { isSubmitting, errors },
		reset,
	} = useForm<CustomerSchema>({
		resolver: zodResolver(customerSchema),
		values: {
			name: customer ? String(customer?.name) : "",
			email: customer ? String(customer?.email) : "",
			phone: customer ? String(customer?.phone) : "",
		},
	});

	const { mutateAsync: createCustomer } = useMutation({
		mutationFn: CreateCustomer,
	});

	const { mutateAsync: updateCustomer } = useMutation({
		mutationFn: UpdateCustomer,
	});

	async function handleCreateCustomer({ name, email, phone }: CustomerSchema) {
		if (customer) {
			try {
				await updateCustomer({
					id: String(customer?.id),
					name,
					email,
					phone,
				});

				toast.success("Cliente Atualizada!");
				setIsCustomerFormOpen(false);
				reset();
				queryClient.invalidateQueries({ queryKey: ["customers"] });
			} catch (err) {
				toast.error("Erro ao atualizar a cliente");
			}
		} else {
			try {
				await createCustomer({
					name,
					email,
					phone,
				});

				toast.success("Cliente criada!");
				setIsCustomerFormOpen(false);
				reset();
				queryClient.invalidateQueries({ queryKey: ["customers"] });
			} catch (err) {
				toast.error("Erro criar cliente");
			}
		}
	}

	return (
		<DialogContent className="min-w-96 w-[80000px]">
			<DialogTitle> </DialogTitle>
			<form
				id="customer-form"
				onSubmit={handleSubmit(handleCreateCustomer)}
				className="flex flex-col gap-1"
			>
				<div className="mb-6 flex flex-col w-full">
					<Label className="mb-2">Nome</Label>
					<Input
						id="name"
						type="text"
						autoCorrect="off"
						{...register("name")}
					/>
					{errors.name && (
						<span className="text-xs font-medium text-red-500 dark:text-red-400 absolute mt-16">
							{errors.name.message}
						</span>
					)}
				</div>
				<div className="mb-6 flex flex-col w-full">
					<Label className="mb-2">E-mail</Label>
					<Input
						id="email"
						type="text"
						autoCorrect="off"
						{...register("email")}
					/>
					{errors.email && (
						<span className="text-xs font-medium text-red-500 dark:text-red-400 absolute mt-16">
							{errors.email.message}
						</span>
					)}
				</div>
				<div className="mb-6 flex flex-col w-full">
					<Label className="mb-2">Telefone celular</Label>
					<Input
						id="phone"
						type="text"
						autoCorrect="off"
						{...register("phone")}
					/>
					{errors.phone && (
						<span className="text-xs font-medium text-red-500 dark:text-red-400 absolute mt-16">
							{errors.phone.message}
						</span>
					)}
				</div>

				<DialogFooter>
					<Button type="submit" disabled={isSubmitting} className="w-full">
						{isSubmitting ? (
							<Loader2 className="h-6 w-6 animate-spin text-gray-50" />
						) : customer ? (
							<Label>Salvar</Label>
						) : (
							<Label>Adicionar</Label>
						)}
					</Button>
				</DialogFooter>
			</form>
			{customer?.id && (
				<>
					<span className="text-1xl font-bold tracking-tight">Endereços</span>
					<div className="flex items-center justify-between">
						<span> </span>
						<Button
							size="xs"
							className="mr-0.5 border-none"
							onClick={() => {
								setSearchParams((state) => {
									state.set("customerId", String(customer?.id));

									return state;
								});

								setIsCustomerAddressFormOpen(true);
							}}
						>
							Adicionar Endereço
						</Button>
					</div>

					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-[240px]">Rua</TableHead>
									<TableHead className="w-[140px]">Número</TableHead>
									<TableHead className="w-[240px]">Cidade</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{customerAddresses?.customerAddresses?.map(
									(customerAddress) => {
										return (
											<CustomerAddressTablerRow
												key={customerAddress?.id}
												customerAddress={customerAddress}
											/>
										);
									},
								)}
							</TableBody>
						</Table>
					</div>
				</>
			)}
			<Dialog
				open={isCustomerAddressFormOpen}
				onOpenChange={setIsCustomerAddressFormOpen}
			>
				<CustomerAddressForm
					setIsCustomerAddressFormOpen={setIsCustomerAddressFormOpen}
				/>
			</Dialog>
		</DialogContent>
	);
}
