import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

export interface MenuItemProps {
  to?: string;
  icon: ReactNode;
  label: string;
  color?: string;
  onClick?: () => void;
  collapsed: boolean;
  disabled?: boolean;
}

export function MenuItem({
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
