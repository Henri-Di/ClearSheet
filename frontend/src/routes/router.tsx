// src/routes/router.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Login from "../pages/Login";
import Dashboard from "../modules/dashboard/pages/Dashboard";
import Categories from "../modules/categories/pages/Categories";
import Sheets from "../modules/sheets/pages/Sheets";
import Transactions from "../modules/transactions/pages/TransactionsPage";
import SheetViewPage from "../modules/sheetView/pages/SheetView";

import { ProtectedRoute } from "./ProtectedRoute";

export const router = createBrowserRouter([
 
  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),

    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "categories", element: <Categories /> },
      { path: "sheets", element: <Sheets /> },
      { path: "sheets/:id", element: <SheetViewPage /> },
      { path: "transactions", element: <Transactions /> },

      { path: "*", element: <Navigate to="/app/dashboard" replace /> },
    ],
  },

 
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);
