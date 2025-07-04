import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./RootLayout";
import Error404 from "../components/Error404";
import LoginPage from "../pages/LoginPage";
import ProductsPage from "../pages/ProductsPage";
import AddProductPage from "../pages/AddNewProductPage";
import OrdersPage from "../pages/OrdersPage";
import CreateOrderPage from "../pages/CreateOrderPage";
import Home from "../pages/Home";

// Определяем basename в зависимости от среды
const basename = import.meta.env.PROD 
  ? "/pcounter-front"  // Для production (GitHub Pages)
  : "/";               // Для разработки

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/products",
        element: <ProductsPage />,
      },
      {
        path: "/orders",
        element: <OrdersPage />,
      },
      {
        path: "/order/new",
        element: <CreateOrderPage />,
      },
      {
        path: "/customers",
        element: <div>Hello Customers!</div>,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/product/new",
        element: <AddProductPage />,
      },
    ],
    errorElement: <Error404 />
  },
],
{
  basename: basename
});

export default router;
