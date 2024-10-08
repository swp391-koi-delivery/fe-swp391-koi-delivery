import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";
import HomePage from "./pages/home/HomePage";
import FeedbackPage from "./pages/feedback/FeedbackPage";
import ProfileUser from "./pages/ProfileUser/ProfileUser";

import ResetPasswordPage from "./pages/reset-password/ResetPasswordPage";
import RequestPasswordPage from "./pages/request-password/RequestPasswordPage";

import Dashboard from "./components/dashboard";
import ManageUser from "./pages/admin/manage-user";
import ManageOrder from "./pages/admin/manage-order";

import DeliveryStaff from "./pages/DeliveryStaff/Dashboard_DS/DeliveryStaff";
import ListOrders from "./pages/DeliveryStaff/ListOrders/ListOrders";
import OrderDetails from "./pages/DeliveryStaff/OrderDetails/OrderDetails";
import OrderRequest from "./pages/DeliveryStaff/OrderRequest/OrderRequest";
import Chat from "./pages/DeliveryStaff/Chat/Chat";
import OrderTracking from "./pages/OrderTracking/OrderTracking";


function App() {
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
      path: "feedback",
      element: <FeedbackPage />,
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
      path: "profileUser",
      element: <ProfileUser />,
    },
    {
        path: "OrderTracking",
        element: <OrderTracking />,
    },
    {
      path: "dashboard",
      element: <Dashboard/>,
      children:[
        {
          path: "user",
          element: <ManageUser/>,
        },
        {
          path: "order",
          element: <ManageOrder/>,
        },
      ]
    },
    {
      path: "deliveryStaff",
      element: <DeliveryStaff />,
      children: [
        {
          path: "listOrders",
          element: <ListOrders />,
        },
        {
          path: "orderRequest",
          element: <OrderRequest />,
        },
        {
          path: "chat",
          element: <Chat />,
        },
        {
          path: "oderDetails/:orderId",
          element: <OrderDetails />,
        },
      ]
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
