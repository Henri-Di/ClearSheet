import { useEffect, useState } from "react";
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
import { ThemeToggle } from "../components/ThemeToggle";
import { api } from "../services/api";
import Swal from "sweetalert2";

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

  const baseStyle = `
    group flex items-center gap-4 px-3 py-2.5 rounded-2xl
    transition-all duration-300 cursor-pointer backdrop-blur-xl
    border border-transparent
    hover:-translate-y-[2px] hover:shadow-md
    ${disabled ? "opacity-50 pointer-events-none" : ""}
  `;

  const activeBg =
    "bg-gradient-to-r from-[#F1E9FF] to-[#F8F5FF] dark:from-[#1d1a29] dark:to-[#262233] border-[#DCD3FF] dark:border-[#373046] shadow-lg scale-[1.02]";
  const idleBg =
    "bg-white/60 dark:bg-[#1d1a26]/60 border-white/20 dark:border-black/20";

  return to ? (
    <Link to={to} className={`${baseStyle} ${color} ${isActive ? activeBg : idleBg}`}>
      <div
        className={`
          p-2 rounded-xl flex items-center justify-center
          transition-all duration-300
          bg-white/70 dark:bg-[#1c1925]
          border border-white/40 dark:border-[#2d263a]
          group-hover:scale-110
          ${isActive ? "scale-110 shadow-md" : ""}
        `}
      >
        {icon}
      </div>

      {!collapsed && (
        <span className="font-medium text-[#3C3B45] dark:text-gray-200 transition-all">
          {label}
        </span>
      )}
    </Link>
  ) : (
    <button
      onClick={onClick}
      className={`${baseStyle} hover:bg-red-50 dark:hover:bg-[#3a1f25]`}
    >
      <div
        className={`
          p-2 rounded-xl flex items-center justify-center
          bg-white/60 dark:bg-[#1c1925]
          border border-white/20 dark:border-[#2d263a]
          group-hover:scale-110 transition-all
        `}
      >
        {icon}
      </div>

      {!collapsed && (
        <span className="font-medium text-red-500 dark:text-red-400">{label}</span>
      )}
    </button>
  );
}

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const applyInitialCollapse = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      }
      setIsReady(true);
    };

    applyInitialCollapse();
    window.addEventListener("resize", applyInitialCollapse);
    return () => window.removeEventListener("resize", applyInitialCollapse);
  }, []);

  async function handleLogout() {
    setLoadingLogout(true);

    Swal.fire({
      title: "Saindo…",
      text: "Aguarde um instante.",
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
      Swal.fire("Erro", "Não foi possível sair.", "error");
    } finally {
      setLoadingLogout(false);
    }
  }

  if (!isReady) {
    return (
      <div className="w-full h-screen bg-light-bg dark:bg-dark-bg opacity-0 pointer-events-none" />
    );
  }

  return (
    <div className="flex min-h-screen bg-light-bg dark:bg-dark-bg transition-all duration-300">
      <aside
        className={`
          fixed lg:relative z-40 flex flex-col h-screen 
          bg-gradient-to-br from-[#F6F3FF] to-[#F1EEFB]
          dark:from-[#14111c] dark:to-[#1b1724]
          border-r border-[#E7E5F0] dark:border-[#2a2538]
          shadow-xl backdrop-blur-2xl
          px-5 py-6 transition-all duration-500 ease-out
          ${collapsed ? "w-20" : "w-72"}
        `}
      >
        <div className="flex items-center justify-between mb-10">
          {!collapsed && (
            <div className="animate-fade-in">
              <ClearSheetLogo />
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="
              p-2 rounded-xl bg-white/70 border border-gray-200 dark:bg-[#1f1b26]
              dark:border-[#2a2538] shadow-sm hover:shadow-md
              hover:-translate-y-[1px] transition-all
            "
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="space-y-2">
          <MenuItem
            to="/app/dashboard"
            icon={<LayoutDashboard size={22} className="text-[#7B61FF]" />}
            color="hover:bg-[#F1E9FF] dark:hover:bg-[#251f32]"
            label="Dashboard"
            collapsed={collapsed}
          />

          <MenuItem
            to="/app/categories"
            icon={<FolderTree size={22} className="text-[#FFA657]" />}
            color="hover:bg-[#FFEBD8] dark:hover:bg-[#33261e]"
            label="Categorias"
            collapsed={collapsed}
          />

          <MenuItem
            to="/app/sheets"
            icon={<FileSpreadsheet size={22} className="text-[#00C184]" />}
            color="hover:bg-[#E6FFF5] dark:hover:bg-[#1d3a32]"
            label="Planilhas"
            collapsed={collapsed}
          />

          <MenuItem
            to="/app/transactions"
            icon={<Receipt size={22} className="text-[#FF6B9F]" />}
            color="hover:bg-[#FFE6F0] dark:hover:bg-[#3a1f2b]"
            label="Transações"
            collapsed={collapsed}
          />
        </nav>

        <div className="border-t border-gray-300 dark:border-[#2a2538] my-6 opacity-30" />

        <MenuItem
          onClick={handleLogout}
          disabled={loadingLogout}
          icon={
            loadingLogout ? (
              <Loader2 size={18} className="animate-spin-ease text-red-500" />
            ) : (
              <LogOut size={20} className="text-red-500" />
            )
          }
          label={loadingLogout ? "Saindo..." : "Sair"}
          collapsed={collapsed}
        />
      </aside>

      <main
        className={`
          flex-1 transition-all duration-300
          ${collapsed ? "ml-20" : "ml-72"}
          lg:ml-0
          p-6 sm:p-8
        `}
      >
        <div className="w-full flex justify-end mb-6">
          <ThemeToggle />
        </div>

        <div
          className="
            max-w-7xl mx-auto min-h-[85vh]
            bg-white/90 dark:bg-[#1a1625]/90
            border border-[#ECEBF5] dark:border-[#2a2538]
            rounded-3xl shadow-xl p-6 sm:p-10
            backdrop-blur-xl animate-fade-in
          "
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}
