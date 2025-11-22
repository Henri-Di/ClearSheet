import type { ReactNode } from "react";
import {
  LayoutDashboard,
  FolderTree,
  FileSpreadsheet,
  Receipt,
  LogOut,
  Loader2,
} from "lucide-react";
import { MenuItem } from "./MenuItem";
import { SidebarHeader } from "./SidebarHeader";

interface NavigationItem {
  label: string;
  icon: ReactNode;
  route: string;
  color?: string;
}

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onLogout: () => void;
  loadingLogout: boolean;
}

const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard size={22} className="text-[#7B61FF]" />,
    route: "/dashboard",
    color: "hover:bg-[#ECE8FF]",
  },
  {
    label: "Categorias",
    icon: <FolderTree size={22} className="text-[#FFA657]" />,
    route: "/categories",
    color: "hover:bg-[#FFF2E6]",
  },
  {
    label: "Planilhas",
    icon: <FileSpreadsheet size={22} className="text-[#00C184]" />,
    route: "/sheets",
    color: "hover:bg-[#E6FFF5]",
  },
  {
    label: "Transações",
    icon: <Receipt size={22} className="text-[#FF6B9F]" />,
    route: "/transactions",
    color: "hover:bg-[#FFE6F0]",
  },
];

export function Sidebar({ collapsed, onToggle, onLogout, loadingLogout }: SidebarProps) {
  return (
    <aside
      className={`
        bg-gradient-to-br from-[#F8F5FF] to-[#F4F2FA]
        border-r border-[#E7E5F0] shadow-xl relative
        p-6 transition-all duration-300 flex flex-col
        ${collapsed ? "w-20" : "w-64"}
      `}
    >
      <SidebarHeader collapsed={collapsed} onToggle={onToggle} />

      <nav className="space-y-2">
        {navigationItems.map((item) => (
          <MenuItem
            key={item.route}
            to={item.route}
            icon={item.icon}
            color={item.color}
            label={item.label}
            collapsed={collapsed}
          />
        ))}
      </nav>

      <div className="border-t border-gray-300 my-6 opacity-60"></div>

      <MenuItem
        onClick={onLogout}
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
  );
}
