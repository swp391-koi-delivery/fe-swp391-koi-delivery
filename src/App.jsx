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
import RequestPasswordPage from "./pages/request-password/RequestPasswordPage";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Dashboard from "./components/dashboard/Dashboard";
import OrderPage from "./pages/order/OrderPage";
import ManageUser from "./pages/manager/manage-user";
function App() {
  const ProtectRouteAuth = ({ children }) => {
    const user = useSelector((store) => store);
    console.log(user);
    if (user && user?.role === "MANAGER") {
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
      path: "login",
      element: <LoginPage />,
    },
    {
      path: "register",
      element: <RegisterPage />,
    },
    {
      path: "request-password",
      element: <RequestPasswordPage />,
    },
    {
      path: "reset-password",
      element: <ResetPasswordPage />,
    },
    {
      path: "order",
      element: <OrderPage />,
    },
    {
      path: "dashboard",
      element: <Dashboard />,
      children: [
        {
          path: "user",
          element: <ManageUser />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
