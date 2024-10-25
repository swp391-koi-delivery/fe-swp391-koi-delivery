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
import OrderListPage from "./pages/order-list/OrderListPage";
import ManageUser from "./pages/manager/manage-user";
import ManageOrder from "./pages/manager/manage-order";
import ManageStatistic from "./pages/manager/manage-statistic";
import LayoutTemplate from "./components/layout/LayoutTemplate";
import OrderList from "./pages/sales-staff";
import OrderDetailStaff from "./pages/sales-staff/orderDetails-staff";
import OrderDetailsInfoStaff from "./pages/sales-staff/orderDetailInfo";
import ManageBox from "./pages/manager/manage-box";
import ManageWarehouse from "./pages/manager/manage-warehouse";
import "./index.css";
import "./App.css";
import SuccessPage from "./pages/success/Success";
import ErrorPage from "./pages/error/ErrorPage";
function App() {
  const ProtectRouteManagerAuth = ({ children }) => {
    const user = useSelector((store) => store);
    console.log(user);
    console.log(user.user);
    if (
      user.user &&
      (user.user?.role === "MANAGER" || user.user?.role === "SALE_STAFF")
    ) {
      return children;
    }
    toast.error("You are not allow to access this");
    return <Navigate to={"/login"} />;
  };
  const ProtectRouteCustomerAuth = ({ children }) => {
    const user = useSelector((store) => store);
    console.log(user);
    console.log(user.user);
    if (user.user && user.user?.role === "CUSTOMER") {
      return children;
    }
    toast.error("You are not allow to access this");
    return <Navigate to={"/login"} />;
  };

  const ProtectRouteDeliveryAuth = ({ children }) => {
    const user = useSelector((store) => store);
    console.log(user);
    console.log(user.user);
    if (user.user && user.user?.role === "DELIVERING_STAFF") {
      return children;
    }
    toast.error("You are not allow to access this");
    return <Navigate to={"/login"} />;
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
      path: "order",
      element: (
        <ProtectRouteCustomerAuth>
          <OrderPage />
        </ProtectRouteCustomerAuth>
      ),
    },
    {
      path: "order-list",
      element: (
        <ProtectRouteCustomerAuth>
          <OrderListPage />
        </ProtectRouteCustomerAuth>
      ),
    },
    {
      path: "success",
      element: <SuccessPage />,
    },
    {
      path: "error",
      element: <ErrorPage />,
    },
    {
      path: "dashboard",
      element: (
        <ProtectRouteManagerAuth>
          <Dashboard />
        </ProtectRouteManagerAuth>
      ),
      children: [
        {
          path: "orderListManagement",
          element: <OrderList />,
        },
        {
          path: "orderDetails/:id",
          element: <OrderDetailStaff />,
        },
        {
          path: "orderDetailsInfo/:id",
          element: <OrderDetailsInfoStaff />,
        },
      ],
    },
    {
      path: "dashboard",
      element: (
        <ProtectRouteManagerAuth>
          <Dashboard />
        </ProtectRouteManagerAuth>
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
          path: "orderDetails/:id",
          element: <OrderDetailStaff />,
        },
        {
          path: "orderDetailsInfo/:id",
          element: <OrderDetailsInfoStaff />,
        },
        {
          path:"box",
          element:<ManageBox/>
        },
        {
          path:"warehouse",
          element:<ManageWarehouse/>
        },
        {
          path: "statistic",
          element: <ManageStatistic />,
        },
      ],
    },
    // {
    //   path: "OrderTracking",
    //   element: <OrderTracking />,
    // },
    // {
    //   path: "profileUser/:id",
    //   element: <ProfileUser />,
    // },
   
  ]);
  return <RouterProvider router={router} />;
}

export default App;
