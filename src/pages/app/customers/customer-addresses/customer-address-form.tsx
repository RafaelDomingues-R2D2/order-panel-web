import { Button } from "@/components/ui/button";
import {
	DialogContent,
	DialogFooter,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { CreateCustomerAddress } from "@/api/customers/customer-addresses/create-customer-address";
import { UpdateCustomerAddress } from "@/api/customers/customer-addresses/update-customer-address";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { queryClient } from "@/lib/react-query";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

export interface CustomerAddressProps {
	setIsCustomerAddressFormOpen: (isOpen: boolean) => void;
	customerAddress?: {
		id?: string;
		customerId: string;
		street: string | null;
		number: string | null;
		neighborhood: string | null;
		city: string | null;
		state: string | null;
		postalCode: string | null;
	};
	customerId?: string;
}

const customerAddressFormSchema = z.object({
	street: z.string().min(1, { message: "Este campo é obrigatório" }),
	number: z.string().min(1, { message: "Este campo é obrigatório" }),
	neighborhood: z.string().min(1, { message: "Este campo é obrigatório" }),
	city: z.string().min(1, { message: "Este campo é obrigatório" }),
	state: z.string().min(1, { message: "Este campo é obrigatório" }),
	postalCode: z.string().min(1, { message: "Este campo é obrigatório" }),
});

type CustomerAddressSchema = z.infer<typeof customerAddressFormSchema>;

export function CustomerAddressForm({
	setIsCustomerAddressFormOpen,
	customerAddress,
}: CustomerAddressProps) {
	const [searchParams] = useSearchParams();

	const customerId = searchParams.get("customerId");

	const {
		register,
		handleSubmit,
		formState: { isSubmitting, errors },
		reset,
		control,
		setValue,
	} = useForm<CustomerAddressSchema>({
		resolver: zodResolver(customerAddressFormSchema),
		values: {
			street: customerAddress ? String(customerAddress?.street) : "",
			number: customerAddress ? String(customerAddress?.number) : "",
			neighborhood: customerAddress
				? String(customerAddress?.neighborhood)
				: "",
			city: customerAddress ? String(customerAddress?.city) : "",
			state: customerAddress ? String(customerAddress?.state) : "",
			postalCode: customerAddress ? String(customerAddress?.postalCode) : "",
		},
	});

	const { mutateAsync: createCustomerAddress } = useMutation({
		mutationFn: CreateCustomerAddress,
	});

	const { mutateAsync: updateCustomerAddress } = useMutation({
		mutationFn: UpdateCustomerAddress,
	});

	async function handleCreateCustomer({
		street,
		number,
		neighborhood,
		city,
		state,
		postalCode,
	}: CustomerAddressSchema) {
		if (customerAddress) {
			try {
				await updateCustomerAddress({
					id: String(customerAddress?.id),
					customerId: String(customerAddress?.customerId),
					street,
					number,
					neighborhood,
					city,
					state,
					postalCode,
				});

				toast.success("Endereço Atualizada!");
				setIsCustomerAddressFormOpen(false);
				reset();
				queryClient.invalidateQueries({
					queryKey: ["customerAddresses", customerId],
				});
			} catch (err) {
				toast.error("Erro ao atualizar a endereço");
			}
		} else {
			try {
				await createCustomerAddress({
					customerId: String(customerId),
					street,
					number,
					neighborhood,
					city,
					state,
					postalCode,
				});

				toast.success("Endereço criad!");
				setIsCustomerAddressFormOpen(false);
				reset();
				queryClient.invalidateQueries({
					queryKey: ["customerAddresses", customerId],
				});
			} catch (err) {
				toast.error("Erro criar endereço");
			}
		}
	}

	const states = [
		{ label: "AC", value: "AC" },
		{ label: "AL", value: "AL" },
		{ label: "AP", value: "AP" },
		{ label: "AM", value: "AM" },
		{ label: "BA", value: "BA" },
		{ label: "CE", value: "CE" },
		{ label: "DF", value: "DF" },
		{ label: "ES", value: "ES" },
		{ label: "GO", value: "GO" },
		{ label: "MA", value: "MA" },
		{ label: "MT", value: "MT" },
		{ label: "MS", value: "MS" },
		{ label: "MG", value: "MG" },
		{ label: "PA", value: "PA" },
		{ label: "PB", value: "PB" },
		{ label: "PR", value: "PR" },
		{ label: "PE", value: "PE" },
		{ label: "PI", value: "PI" },
		{ label: "RJ", value: "RJ" },
		{ label: "RN", value: "RN" },
		{ label: "RS", value: "RS" },
		{ label: "RO", value: "RO" },
		{ label: "RR", value: "RR" },
		{ label: "SC", value: "SC" },
		{ label: "SP", value: "SP" },
		{ label: "SE", value: "SE" },
		{ label: "TO", value: "TO" },
	];

	return (
		<DialogContent className="min-w-96">
			<DialogTitle> </DialogTitle>
			<form
				id="order-item-form"
				onSubmit={handleSubmit(handleCreateCustomer)}
				className="flex flex-col gap-1"
			>
				<div className="mb-6 flex flex-col ml-2">
					<Label className="mb-2">Rua</Label>
					<Input
						id="street"
						type="text"
						autoCorrect="off"
						{...register("street")}
					/>
					{errors.street && (
						<span className="text-xs font-medium text-red-500 dark:text-red-400 absolute mt-16">
							{errors.street.message}
						</span>
					)}
				</div>
				<div className="mb-6 flex flex-col ml-2">
					<Label className="mb-2">Número</Label>
					<Input
						id="number"
						type="text"
						autoCorrect="off"
						{...register("number")}
					/>
					{errors.number && (
						<span className="text-xs font-medium text-red-500 dark:text-red-400 absolute mt-16">
							{errors.number.message}
						</span>
					)}
				</div>
				<div className="mb-6 flex flex-col ml-2">
					<Label className="mb-2">Bairro</Label>
					<Input
						id="neighborhood"
						type="text"
						autoCorrect="off"
						{...register("neighborhood")}
					/>
					{errors.neighborhood && (
						<span className="text-xs font-medium text-red-500 dark:text-red-400 absolute mt-16">
							{errors.neighborhood.message}
						</span>
					)}
				</div>
				<div className="mb-6 flex flex-col ml-2">
					<Label className="mb-2">Cidade</Label>
					<Input
						id="city"
						type="text"
						autoCorrect="off"
						{...register("city")}
					/>
					{errors.city && (
						<span className="text-xs font-medium text-red-500 dark:text-red-400 absolute mt-16">
							{errors.city.message}
						</span>
					)}
				</div>
				<div className="mb-6 flex flex-col w-full">
					<Label className="mb-2">Categorias</Label>
					<Controller
						name="state"
						control={control}
						render={({ field: { value } }) => (
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										// biome-ignore lint/a11y/useSemanticElements: <explanation>
										role="combobox"
										className="w-auto justify-between"
									>
										{value
											? states.find((state) => state.value === value)?.label
											: "Categorias"}
										<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-[200px] p-0">
									<Command>
										<CommandInput placeholder="Procurar..." />
										<CommandList>
											<CommandEmpty>Nada por aqui...</CommandEmpty>
											<CommandGroup>
												{states.map((state) => (
													<CommandItem
														key={state.value}
														value={state.value}
														onSelect={(currentValue) => {
															setValue(
																"state",
																currentValue === value ? "" : currentValue,
															);
														}}
													>
														<Check
															className={cn(
																"mr-2 h-4 w-4",
																value === state.value
																	? "opacity-100"
																	: "opacity-0",
															)}
														/>
														{state.label}
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
						)}
					/>
					{errors.state && (
						<span className="text-xs font-medium text-red-500 dark:text-red-400 absolute mt-16">
							{errors.state.message}
						</span>
					)}
				</div>
				<div className="mb-6 flex flex-col ml-2">
					<Label className="mb-2">CEP</Label>
					<Input
						id="postalCode"
						type="text"
						autoCorrect="off"
						{...register("postalCode")}
					/>
					{errors.postalCode && (
						<span className="text-xs font-medium text-red-500 dark:text-red-400 absolute mt-16">
							{errors.postalCode.message}
						</span>
					)}
				</div>

				<DialogFooter>
					<Button type="submit" disabled={isSubmitting} className="w-full">
						{isSubmitting ? (
							<Loader2 className="h-6 w-6 animate-spin text-gray-50" />
						) : customerAddress ? (
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
