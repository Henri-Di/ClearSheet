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

// ========================================================
// MENU ITEM COMPONENT
// ========================================================
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
    ${disabled ? "opacity-50 pointer-events-none" : ""}
    ${color}
  `;

  const activeClass = isActive
    ? `
      bg-gradient-to-r from-[#EDE7FF] to-[#F6F2FF]
      border-[#D0C9FF] shadow-md
    `
    : "";

  const iconWrapper = (
    <div
      className={`
        flex items-center justify-center rounded-xl p-2
        ${isActive ? "bg-white shadow-sm border border-gray-200" : "bg-white/70"}
      `}
    >
      {icon}
    </div>
  );

  const content = (
    <>
      <span className={`${collapsed ? "mx-auto" : ""}`}>{iconWrapper}</span>

      {!collapsed && (
        <span className="font-medium text-[#3C3B45] tracking-wide">
          {label}
        </span>
      )}

      {!collapsed && isActive && (
        <span className="ml-auto text-xs bg-white px-2 py-0.5 rounded-full border border-gray-200 text-gray-500">
          Ativo
        </span>
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`${base} ${activeClass}`}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={`${base} hover:bg-red-50`}>
      {content}
    </button>
  );
}

// ========================================================
// MAIN LAYOUT
// ========================================================
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
    <div className="flex min-h-screen bg-[#FBFAFF]">

      {/* ========================================================
         SIDEBAR PREMIUM
      ======================================================== */}
      <aside
        className={`
          bg-gradient-to-br from-[#F8F5FF] to-[#F4F2FA]
          border-r border-[#E7E5F0] shadow-xl relative
          p-6 transition-all duration-300 flex flex-col
          ${collapsed ? "w-20" : "w-64"}
        `}
      >
        {/* LOGO + COLLAPSER */}
        <div className="flex items-center justify-between mb-10">
          {!collapsed && <ClearSheetLogo />}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="
              p-2 rounded-xl bg-white border border-gray-200 shadow-sm 
              hover:shadow-md transition hover:-translate-y-0.5
            "
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="space-y-2">

          {/* DASHBOARD - roxo principal */}
          <MenuItem
            to="/dashboard"
            icon={<LayoutDashboard size={22} className="text-[#7B61FF]" />}
            color="hover:bg-[#ECE8FF]"
            label="Dashboard"
            collapsed={collapsed}
          />

          {/* CATEGORIAS - laranja pastel */}
          <MenuItem
            to="/categories"
            icon={<FolderTree size={22} className="text-[#FFA657]" />}
            color="hover:bg-[#FFF2E6]"
            label="Categorias"
            collapsed={collapsed}
          />

          {/* PLANILHAS - verde menta */}
          <MenuItem
            to="/sheets"
            icon={<FileSpreadsheet size={22} className="text-[#00C184]" />}
            color="hover:bg-[#E6FFF5]"
            label="Planilhas"
            collapsed={collapsed}
          />

          {/* TRANSAÇÕES - rosa suave */}
          <MenuItem
            to="/transactions"
            icon={<Receipt size={22} className="text-[#FF6B9F]" />}
            color="hover:bg-[#FFE6F0]"
            label="Transações"
            collapsed={collapsed}
          />

        </nav>


        {/* DIVIDER */}
        <div className="border-t border-gray-300 my-6 opacity-60"></div>

        {/* LOGOUT */}
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
          color="hover:bg-red-50"
          collapsed={collapsed}
        />
      </aside>

      {/* ========================================================
         MAIN CONTENT
      ======================================================== */}
      <main className="flex-1 p-10 bg-[#FBFAFF]">
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
