import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Sheets from "./pages/Sheets";
import Transactions from "./pages/Transactions";

import MainLayout from "./layouts/MainLayout";
import { ProtectedRoute } from "./routes/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN PÚBLICO */}
        <Route path="/login" element={<Login />} />

        {/* ROTAS PROTEGIDAS (AUTENTICADAS) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* Categorias */}
          <Route path="categories" element={<Categories />} />

          {/* Planilhas */}
          <Route path="sheets" element={<Sheets />} />

          {/* Transações */}
          <Route path="transactions" element={<Transactions />} />
        </Route>

        {/* REDIRECIONAMENTO AUTOMÁTICO */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* Rota fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
