import { getCategories } from "@/api/categories/get-categories";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {  useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { CategoriesTablerRow } from "./categories-table-row";
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { CategoryForm } from "./category-form";

export function Categories() {
		const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
	
	const { data: categories } = useQuery({
		queryKey: ["categories"],
		queryFn: () => getCategories(),
	});

	

	return (
		<>
			<Helmet title="Categorias" />
			<div className="flex flex-col gap-4">
				<h1 className="text-3xl font-bold tracking-tight">Categorias</h1>
				<div className="flex items-center justify-between">
					<span> </span>
					<Button
						size="xs"
						className="mr-0.5 border-none"
						onClick={() => {
							setIsCategoryFormOpen(true);
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
							{categories &&
								categories.categories.map((category) => {
									return (
										<CategoriesTablerRow
											key={category.id}
											categories={category}
										/>
									);
								})}
						</TableBody>
					</Table>
				</div>
				<Dialog open={isCategoryFormOpen} onOpenChange={setIsCategoryFormOpen}>
					<CategoryForm
						setIsCategoryFormOpen={setIsCategoryFormOpen}
					/>
				</Dialog>
			</div>
		</>
	);
}
