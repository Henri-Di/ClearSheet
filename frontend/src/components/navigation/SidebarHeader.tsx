import { ChevronLeft, ChevronRight } from "lucide-react";
import { ClearSheetLogo } from "../../layouts/ClearSheetLogo";

interface SidebarHeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function SidebarHeader({ collapsed, onToggle }: SidebarHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-10">
      {!collapsed && <ClearSheetLogo />}

      <button
        onClick={onToggle}
        className="
          p-2 rounded-xl bg-white border border-gray-200 shadow-sm
          hover:shadow-md transition hover:-translate-y-0.5
        "
      >
        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>
    </div>
  );
}
