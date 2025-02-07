import { getProducts } from "@/api/products/get-products";
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
import { ProductForm } from "./product-form";
import { ProductsTablerRow } from "./products-table-row";

export function Products() {
	const [isProductFormOpen, setIsProductFormOpen] = useState(false);

	const { data: products } = useQuery({
		queryKey: ["products"],
		queryFn: () => getProducts(),
	});

	return (
		<>
			<Helmet title="Produtos" />
			<div className="flex flex-col gap-4">
				<h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
				<div className="flex items-center justify-between">
					<span> </span>
					<Button
						size="xs"
						className="mr-0.5 border-none"
						onClick={() => {
							setIsProductFormOpen(true);
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
								<TableHead className="w-[240px]">Preço</TableHead>
								<TableHead className="w-[240px]">Estoque</TableHead>
								<TableHead className="w-[240px]">Categoria</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{/* {isLoadingTransactions && <TransactionTableSkeleton />} */}
							{/* biome-ignore lint/complexity/useOptionalChain: <explanation> */}
							{products &&
								products.products.map((product) => {
									return (
										<ProductsTablerRow key={product.id} products={product} />
									);
								})}
						</TableBody>
					</Table>
				</div>
				<Dialog open={isProductFormOpen} onOpenChange={setIsProductFormOpen}>
					<ProductForm setIsProductFormOpen={setIsProductFormOpen} />
				</Dialog>
			</div>
		</>
	);
}
