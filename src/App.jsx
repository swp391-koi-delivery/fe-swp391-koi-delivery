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
import OrderList from "./pages/sales-staff";
import LayoutTemplate from "./components/layout/LayoutTemplate";

import ProfileUser from "./pages/ProfileUser/ProfileUser";
// Delivery Staff
import DeliveryStaff from "./pages/DeliveryStaff/Dashboard_DS/DeliveryStaff";
import ListOrders from "./pages/DeliveryStaff/ListOrders/ListOrders";
import OrderDetails from "./pages/DeliveryStaff/OrderDetails/OrderDetails";
import OrderRequest from "./pages/DeliveryStaff/OrderRequest/OrderRequest";
import Chat from "./pages/DeliveryStaff/Chat/Chat";
import OrderRouting from "./pages/DeliveryStaff/OrderRouting/OrderRouting";
import OrderTracking from "./pages/OrderTracking/OrderTracking";
import OrderDetailsInfo from "./pages/DeliveryStaff/OrderDetailsInfo/OrderDetailsInfo";

import "./index.css";
import "./App.css";
//import CartPage from "./pages/cart/CartPage";
import OrderDetailStaff from "./pages/sales-staff/orderDetails-staff";
import OrderHistoryPage from "./pages/order-history/OrderHistoryPage";
import OrderTrackingPage from "./pages/order-tracking/OrderTrackingPage";
function App() {
  const ProtectRouteManagerAuth = ({ children }) => {
    const user = useSelector((store) => store);
    console.log(user);
    console.log(user.user);
    if (
      user.user &&
      (user.user?.role === "Manager" || user.user?.role === "Sale_staff")
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
      path: "order-history",
      element: (
        <ProtectRouteCustomerAuth>
          <OrderHistoryPage />
        </ProtectRouteCustomerAuth>
      ),
    },
    {
      path: "order-tracking",
      element: (
        <ProtectRouteCustomerAuth>
          <OrderTrackingPage />
        </ProtectRouteCustomerAuth>
      ),
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
          path: "statistic",
          element: <ManageStatistic />,
        },
      ],
    },
    {
      path: "OrderTracking",
      element: <OrderTracking />,
    },
    {
      path: "profileUser/:id",
      element: <ProfileUser />,
    },
    {
      path: "deliveryStaff",

      element: (
        <ProtectRouteDeliveryAuth>
          <DeliveryStaff />
        </ProtectRouteDeliveryAuth>
      ),
      children: [
        {
          path: "listOrders_Deli",
          element: <ListOrders />,
        },
        {
          path: "orderRequest_Deli",
          element: <OrderRequest />,
        },
        {
          path: "chat_Deli",
          element: <Chat />,
        },
        {
          path: "orderRouting_Deli",
          element: <OrderRouting />,
        },
        {
          path: "orderDetails_Deli/:id",
          element: <OrderDetails />,
        },
        {
          path: "orderDetailsInfo_Deli/:id",
          element: <OrderDetailsInfo />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
