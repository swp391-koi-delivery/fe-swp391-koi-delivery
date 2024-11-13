import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

// Customer
import LayoutTemplate from "./components/layout/LayoutTemplate";
import Dashboard from "./components/dashboard/Dashboard";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";
import HomePage from "./pages/home/HomePage";
import ResetPasswordPage from "./pages/reset-password/ResetPasswordPage";
import ForgotPasswordPage from "./pages/forgot-password/ForgotPasswordPage";
import OrderPage from "./pages/order/OrderPage";
import OrderListPage from "./pages/order-list/OrderListPage";
import OrderSearchPage from "./pages/order-search/OrderSearchPage";
import OrderHistoryPage from "./pages/order-history/OrderHistory";
import SuccessPage from "./pages/success/SuccessPage";
import ErrorPage from "./pages/error/ErrorPage";

// Manager & Sales Staff
import OrderList from "./pages/sales-staff";
import OrderDetailStaff from "./pages/sales-staff/orderDetails-staff";
import OrderDetailsInfoStaff from "./pages/sales-staff/orderDetailInfo";
import ManageBox from "./pages/manager/manage-box";
import ManageWarehouse from "./pages/manager/manage-warehouse";

import ManageProfile from "./pages/manager/ManagerProfile";
import BoxDetailsStaff from "./pages/sales-staff/BoxDetails-staff";
import ManageUser from "./pages/manager/manage-user";
import ManageOrder from "./pages/manager/manage-order";
import ManageStatistic from "./pages/manager/manage-statistic";

import ProfileUser from "./pages/ProfileUser/ProfileUser";
// Delivery Staff
import DeliveryStaff from "./pages/DeliveryStaff/Dashboard_DS/DeliveryStaff";
import DeliStaffProfile from "./pages/DeliveryStaff/DeliStaffProfile/DeliStaffProfile";
import ListOrders from "./pages/DeliveryStaff/ListOrders/ListOrders";
import OrderDetails from "./pages/DeliveryStaff/ListOrders/OrderDetails/OrderDetails";
import OrderProgress from "./pages/DeliveryStaff/ListOrders/OrderProgress/OrderProgress";
import OrderDetailsInfo from "./pages/DeliveryStaff/ListOrders/OrderDetails/OrderDetailsInfo/OrderDetailsInfo";
import BoxDetails from "./pages/DeliveryStaff/ListOrders/OrderDetails/BoxDetails/BoxDetails";
// Map & Routing
import MapComponent from "./pages/DeliveryStaff/MapComponent/MapComponent";
import MapPlatform from "./pages/DeliveryStaff/MapComponent/MapPlatform/MapPlatform";
import OrderRouting from "./pages/DeliveryStaff/MapComponent/OrderRouting/OrderRouting";


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
        {
          path: "order-search",
          element: <OrderSearchPage />,
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
        {
          path: "boxDetails/:id",
          element: <BoxDetailsStaff />,
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
          path: "profile",
          element: <ManageProfile />,
        },
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
          path: "boxDetails/:id",
          element: <BoxDetailsStaff />,
        },
        {
          path:"box",
          element:<ManageBox/>

        },
        {
          path: "warehouse",
          element: <ManageWarehouse />,
        },
        {
          path: "statistic",
          element: <ManageStatistic />,
        },
      ],
    },
    {
      path: "profileUser",
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
          path: "deliStaffProfile",
          element: <DeliStaffProfile />,
        },
        {
          path: "orderDetails_Deli/:id",
          element: <OrderDetails />,
        },
        {
          path: "orderDetailsInfo_Deli/:id",
          element: <OrderDetailsInfo />,
        },
        {
          path: "boxDetails_Deli/:id",
          element: <BoxDetails />,
        },
        {
          path: "orderProgress/:id",
          element: <OrderProgress />,
        },
        {
          path: "MapComponent",
          element: <MapComponent />,
          children: [
            {
              path: "MapPlatform",
              element: <MapPlatform />,
            },
            {
              path: "orderRouting_Deli",
              element: <OrderRouting />,
            },
          ],
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
