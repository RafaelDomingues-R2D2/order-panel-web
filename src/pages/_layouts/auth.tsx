import { Store } from "lucide-react";
import { Outlet } from "react-router-dom";

export function AuthLayout() {
	return (
		<div className="grid min-h-screen grid-cols-1 lg:grid-cols-2 antialiased">
			<div className="lg:flex h-full flex-col justify-between border-r border-foreground/5 bg-muted p-10 text-muted-foreground hidden">
				<div className="flex items-center gap-3 text-lg text-foreground">
					<Store color="#CE1C43" className="h-5 w-5" />
					<span className="font-semibold">Painel de Pedido</span>
				</div>

				<footer className="text-sm">
					Painel de pedido &copy; Painel de Pedido - {new Date().getFullYear()}
				</footer>
			</div>

			<div className="flex items-center gap-3 text-lg text-foreground ml-12 lg:hidden">
				<Store color="#CE1C43" className="h-5 w-5" />
				<span className="font-semibold">Painel de Pedido</span>
			</div>
			<div className="relative flex flex-col items-center justify-center">
				<Outlet />
			</div>
			<footer className="text-sm ml-12 lg:hidden">
				Painel de pedido &copy; Painel de Pedido - {new Date().getFullYear()}
			</footer>
		</div>
	);
}
