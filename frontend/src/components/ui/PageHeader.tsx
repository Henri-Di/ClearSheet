import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  /**
   * Optional leading icon to contextualize the page.
   */
  icon?: ReactNode;
  /**
   * Use for buttons or quick filters aligned to the right side.
   */
  actions?: ReactNode;
  /**
   * Small helper text shown under the title when provided.
   */
  subtitle?: string;
}

export function PageHeader({ title, icon, actions, subtitle }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="p-2 rounded-xl bg-[#F3F0FF] border border-[#E0DCFF] text-[#7B61FF]">
            {icon}
          </div>
        )}

        <div>
          <h1 className="font-display text-3xl font-semibold text-[#2F2F36] tracking-tight">
            {title}
          </h1>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
      </div>

      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
