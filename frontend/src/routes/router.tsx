// src/routes/router.tsx

import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

// Pages
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Categories from "../pages/Categories";
import Sheets from "../pages/Sheets";
import SheetView from "../pages/SheetView";   // <-- IMPORTANTE
import Transactions from "../pages/Transactions";

import { ProtectedRoute } from "./ProtectedRoute";

export const router = createBrowserRouter([

  // Login público
  {
    path: "/login",
    element: <Login />,
  },

  // Rotas protegidas
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),

    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "categories", element: <Categories /> },

      // === Sheets ===
      { path: "sheets", element: <Sheets /> },
      { path: "sheets/:id", element: <SheetView /> },   // <-- ROTA CORRETA

      // Transactions
      { path: "transactions", element: <Transactions /> },
    ],
  },
]);
