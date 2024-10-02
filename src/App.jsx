import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";
import HomePage from "./pages/home/HomePage";
import FeedbackPage from "./pages/feedback/FeedbackPage";
import Dashboard from "./components/dashboard";
import ManageUser from "./pages/admin/manage-user";
import ManageOrder from "./pages/admin/manage-order";

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
        }
      ]
    }
  ]);
  return <RouterProvider router={router} />;
}

export default App;
