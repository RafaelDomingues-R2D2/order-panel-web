import { ClipboardList, Home, List, Package, Store, Users } from "lucide-react";

import { AccountMenu } from "./account-menu";
import { NavLink } from "./nav-link";
import { ModeToggle } from "./theme/theme-toggle";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { Separator } from "./ui/separator";

export function Header() {
	return (
		<div className="border-b">
			<div className="flex h-16 items-center gap-6 px-6">
				<Store color="#CE1C43" className="h-6 w-6" />

				<Separator orientation="vertical" className="h-6" />

				<nav className="flex items-center space-x-4 lg:space-x-6">
					<NavLink to="/">
						<Home className="h-4 w-4" />
						Início
					</NavLink>
					<NavigationMenu>
						<NavigationMenuList>
							<NavigationMenuItem>
								<NavigationMenuTrigger>Cadastros</NavigationMenuTrigger>
								<NavigationMenuContent>
									<ul className="grid w-[400px] gap-3 p-4 md:w-[160px] lg:w-[160px] ">
										<NavLink to="/customers">
											<Users className="h-4 w-4" />
											Clientes
										</NavLink>
										<NavLink to="/categories">
											<List className="h-4 w-4" />
											Categorias
										</NavLink>
										<NavLink to="/products">
											<Package className="h-4 w-4" />
											Produtos
										</NavLink>
									</ul>
								</NavigationMenuContent>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>

					<NavLink to="/orders">
						<ClipboardList className="h-4 w-4" />
						Pedidos
					</NavLink>
				</nav>
				<div className="ml-auto flex items-center gap-2">
					<ModeToggle />
					<AccountMenu />
				</div>
			</div>
		</div>
	);
}
