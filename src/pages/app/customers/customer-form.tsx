import { Button } from "@/components/ui/button";
import {
	DialogContent,
	DialogFooter,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { CreateCustomer } from "@/api/customers/create-customer";
import { UpdateCustomer } from "@/api/customers/update-customer";
import { queryClient } from "@/lib/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
		<DialogContent className="min-w-96">
			<DialogTitle> </DialogTitle>
			<form
				id="order-item-form"
				onSubmit={handleSubmit(handleCreateCustomer)}
				className="flex flex-col gap-1"
			>
				<div className="mb-6 flex flex-col ml-2">
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
				<div className="mb-6 flex flex-col ml-2">
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
				<div className="mb-6 flex flex-col ml-2">
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
		</DialogContent>
	);
}
