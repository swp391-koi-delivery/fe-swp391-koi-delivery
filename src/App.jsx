import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";
import HomePage from "./pages/home/HomePage";
import FeedbackPage from "./pages/feedback/FeedbackPage";
import ResetPasswordPage from "./pages/reset-password/ResetPasswordPage";
import RequestPasswordPage from "./pages/request-password/RequestPasswordPage";
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
  ]);
  return <RouterProvider router={router} />;
}

export default App;
