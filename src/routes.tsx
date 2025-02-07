import { createBrowserRouter } from "react-router-dom";

import { NotFound } from "./pages/404";
import { AppLayout } from "./pages/_layouts/app";
import { AuthLayout } from "./pages/_layouts/auth";
import { Categories } from "./pages/app/categories/categories";
import { Customers } from "./pages/app/customers/customers";
import { Dashboard } from "./pages/app/dashboard/dashboard";
import { Orders } from "./pages/app/orders/orders";
import { Products } from "./pages/app/products/products";
import { SignIn } from "./pages/auth/sign-in";
// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
import { Error } from "./pages/error";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <AppLayout />,
		errorElement: <Error />,
		children: [
			{ path: "/", element: <Dashboard /> },
			{ path: "/customers", element: <Customers /> },
			{ path: "/categories", element: <Categories /> },
			{ path: "/products", element: <Products /> },
			{ path: "/orders", element: <Orders /> },
		],
	},
	{
		path: "/",
		element: <AuthLayout />,
		children: [{ path: "/sign-in", element: <SignIn /> }],
	},
	{
		path: "*",
		element: <NotFound />,
	},
]);
