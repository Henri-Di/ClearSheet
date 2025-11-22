import type { ReactNode } from "react";
import { Card } from "./Card";

interface StatBadgeProps {
  title: string;
  value: ReactNode;
  /**
   * Optional icon displayed floating on the top-left corner.
   */
  icon?: ReactNode;
  /**
   * Tailwind class that controls the badge background behind the icon.
   */
  iconBgClassName?: string;
}

export function StatBadge({ title, value, icon, iconBgClassName }: StatBadgeProps) {
  return (
    <Card className="relative overflow-hidden">
      {icon && (
        <div
          className={[
            "absolute -top-4 left-4 p-3 rounded-2xl shadow-sm border border-white",
            iconBgClassName ?? "bg-[#EDE7FF]",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {icon}
        </div>
      )}

      <div className="mt-6">
        <p className="text-sm text-[#5A556A] font-medium mb-1">{title}</p>
        <div className="text-4xl font-display font-semibold text-[#2F2F36] tracking-tight">
          {value}
        </div>
      </div>
    </Card>
  );
}
