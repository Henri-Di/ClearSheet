import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderTree,
  FileSpreadsheet,
  Receipt,
  LogOut,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { ClearSheetLogo } from "./ClearSheetLogo";
import { api } from "../services/api";
import Swal from "sweetalert2";
import { ThemeToggle } from "../components/ThemeToggle";

interface MenuItemProps {
  to?: string;
  icon: React.ReactNode;
  label: string;
  color?: string;
  onClick?: () => void;
  collapsed: boolean;
  disabled?: boolean;
}

function MenuItem({
  to,
  icon,
  label,
  color = "",
  onClick,
  collapsed,
  disabled = false,
}: MenuItemProps) {
  const location = useLocation();
  const isActive = to && location.pathname.startsWith(to);

  const base = `
    flex items-center gap-4 p-3 rounded-xl transition-all
    hover:shadow-md hover:-translate-y-0.5
    backdrop-blur-xl border border-transparent
    text-[#3C3B45] dark:text-gray-100
    ${disabled ? "opacity-50 pointer-events-none" : ""}
    ${color}
  `;

  const activeClass = isActive
    ? `
      bg-gradient-to-r from-[#EDE7FF] to-[#F6F2FF]
      dark:from-[#2a2342] dark:to-[#1e1a31]
      border-[#D0C9FF] dark:border-[#3a3455]
      shadow-md
    `
    : "";

  return to ? (
    <Link to={to} className={`${base} ${activeClass}`}>
      <div
        className={`
          flex items-center justify-center rounded-xl p-2
          ${
            isActive
              ? "bg-white dark:bg-[#2c2a38] shadow-sm border border-gray-200 dark:border-dark-border"
              : "bg-white/70 dark:bg-[#2b2b33]"
          }
        `}
      >
        {icon}
      </div>

      {!collapsed && (
        <span className="font-medium tracking-wide text-[#3C3B45] dark:text-gray-100">
          {label}
        </span>
      )}

      {!collapsed && isActive && (
        <span className="ml-auto text-xs bg-white dark:bg-[#2f2a41] px-2 py-0.5 rounded-full border border-gray-200 dark:border-dark-border text-gray-500 dark:text-gray-300">
          Ativo
        </span>
      )}
    </Link>
  ) : (
    <button
      onClick={onClick}
      className={`${base} hover:bg-red-50 dark:hover:bg-[#3a2a2a]`}
    >
      <div className="flex items-center justify-center rounded-xl p-2 bg-white/70 dark:bg-[#2b2b33]">
        {icon}
      </div>

      {!collapsed && (
        <span className="font-medium tracking-wide text-[#3C3B45] dark:text-gray-100">
          {label}
        </span>
      )}
    </button>
  );
}

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const navigate = useNavigate();

  async function handleLogout() {
    setLoadingLogout(true);

    Swal.fire({
      title: "Saindo...",
      text: "Aguarde enquanto finalizamos sua sessão.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      await api.post("/logout");
      localStorage.removeItem("token");
      Swal.close();
      navigate("/login");
    } catch {
      Swal.fire("Erro", "Não foi possível finalizar o logout.", "error");
    } finally {
      setLoadingLogout(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-[#FBFAFF] dark:bg-dark-bg text-gray-800 dark:text-gray-100 transition-all">
      <aside
        className={`
          bg-gradient-to-br from-[#F8F5FF] to-[#F4F2FA]
          dark:from-[#1e1b26] dark:to-[#15131c]
          border-r border-[#E7E5F0] dark:border-dark-border
          shadow-xl relative p-6 transition-all duration-300 flex flex-col
          ${collapsed ? "w-20" : "w-64"}
        `}
      >
        <div className="flex items-center justify-between mb-10">
          {!collapsed && <ClearSheetLogo />}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="
              p-2 rounded-xl bg-white dark:bg-dark-card
              border border-gray-200 dark:border-dark-border
              shadow-sm hover:shadow-md transition hover:-translate-y-0.5
              text-gray-700 dark:text-gray-200
            "
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="space-y-2">
          <MenuItem
            to="/app/dashboard"
            icon={<LayoutDashboard size={22} className="text-[#7B61FF]" />}
            color="hover:bg-[#ECE8FF] dark:hover:bg-[#322a45]"
            label="Dashboard"
            collapsed={collapsed}
          />

          <MenuItem
            to="/app/categories"
            icon={<FolderTree size={22} className="text-[#FFA657]" />}
            color="hover:bg-[#FFF2E6] dark:hover:bg-[#3c2e1e]"
            label="Categorias"
            collapsed={collapsed}
          />

          <MenuItem
            to="/app/sheets"
            icon={<FileSpreadsheet size={22} className="text-[#00C184]" />}
            color="hover:bg-[#E6FFF5] dark:hover:bg-[#1c3a31]"
            label="Planilhas"
            collapsed={collapsed}
          />

          <MenuItem
            to="/app/transactions"
            icon={<Receipt size={22} className="text-[#FF6B9F]" />}
            color="hover:bg-[#FFE6F0] dark:hover:bg-[#40212f]"
            label="Transações"
            collapsed={collapsed}
          />
        </nav>

        <div className="border-t border-gray-300 dark:border-dark-border my-6 opacity-60"></div>

        <MenuItem
          onClick={handleLogout}
          disabled={loadingLogout}
          icon={
            loadingLogout ? (
              <Loader2 size={18} className="animate-spin text-red-500" />
            ) : (
              <LogOut size={20} className="text-red-500" />
            )
          }
          label={loadingLogout ? "Saindo..." : "Sair"}
          color="hover:bg-red-50 dark:hover:bg-[#4c1f1f]"
          collapsed={collapsed}
        />
      </aside>

      <main className="flex-1 p-10 bg-[#FBFAFF] dark:bg-dark-bg text-gray-900 dark:text-gray-100 transition-all">
        <header className="flex items-center justify-between mb-8 px-1 text-gray-700 dark:text-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            ClearSheet
          </h2>
          <ThemeToggle />
        </header>

        <div
          className="
            max-w-7xl mx-auto min-h-[85vh]
            bg-white dark:bg-[#1a1625]
            border border-[#ECEBF5] dark:border-[#2a2538]
            rounded-3xl shadow-lg p-10 transition-all
            text-gray-800 dark:text-gray-100
          "
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}
