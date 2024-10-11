import React, { useEffect } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";
import HomePage from "./pages/home/HomePage";
import ResetPasswordPage from "./pages/reset-password/ResetPasswordPage";
import ForgotPasswordPage from "./pages/forgot-password/ForgotPasswordPage";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Dashboard from "./components/dashboard/Dashboard";
import OrderPage from "./pages/order/OrderPage";
import ManageUser from "./pages/manager/manage-user";
import ManageOrder from "./pages/manager/manage-order";
import ManageStatistic from "./pages/manager/manage-statistic";
import OrderList from "./pages/salesstaff";
import LayoutTemplate from "./components/layout/LayoutTemplate";
import "./index.css";
import "./App.css";
import CartPage from "./pages/cart/CartPage";
function App() {
  const ProtectRouteAuth = ({ children }) => {
    const user = useSelector((store) => store);
    console.log(user);
    console.log(user.user);
    if (
      user.user &&
      (user.user?.role === "MANAGER" ||
        user.user?.role === "SALES_STAFF" ||
        user.user?.role === "DELIVERY_STAFF")
    ) {
      return children;
    }
    toast.error("You are not allow to access this");
    return <Navigate to={"login"} />;
  };

  const router = createBrowserRouter([
    {
      path: "",
      element: <HomePage />,
    },
    {
      path: "",
      element: <LayoutTemplate />,
      children: [
        {
          path: "login",
          element: <LoginPage />,
        },
        {
          path: "register",
          element: <RegisterPage />,
        },
        {
          path: "forgot-password",
          element: <ForgotPasswordPage />,
        },
        {
          path: "reset-password",
          element: <ResetPasswordPage />,
        },
      ],
    },
    {
      path: "cart",
      element: <CartPage />,
    },
    {
      path: "order",
      element: <OrderPage />,
    },
    {
      path: "orderList",
      element: <OrderList />,
    },
    {
      path: "dashboard",
      element: (
        <ProtectRouteAuth>
          <Dashboard />
        </ProtectRouteAuth>
      ),
      children: [
        {
          path: "user",
          element: <ManageUser />,
        },
        {
          path: "order",
          element: <ManageOrder />,
        },
        {
          path: "statistic",
          element: <ManageStatistic />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
