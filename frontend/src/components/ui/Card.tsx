import type { ReactNode } from "react";

interface CardProps {
  /**
   * Optional title displayed in the header area of the card.
   */
  title?: string;
  /**
   * Optional leading icon displayed next to the title. Keep lightweight
   * (e.g., lucide icons) so the component stays theme-agnostic.
   */
  icon?: ReactNode;
  /**
   * Actions (buttons, links, badges) aligned to the right side of the header.
   */
  actions?: ReactNode;
  children: ReactNode;
  /**
   * Extra classes for the outer card container.
   */
  className?: string;
  /**
   * Extra classes for the content wrapper. Useful to adjust padding per use.
   */
  contentClassName?: string;
  /**
   * Removes the default padding from the content wrapper when set to true.
   */
  noContentPadding?: boolean;
}

export function Card({
  title,
  icon,
  actions,
  children,
  className,
  contentClassName,
  noContentPadding,
}: CardProps) {
  const container = [
    "bg-white border border-[#E6E1F7] rounded-3xl shadow-sm",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = [
    noContentPadding ? undefined : "p-6",
    contentClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={container}>
      {(title || actions) && (
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F2EEF9]">
          <div className="flex items-center gap-2">
            {icon && (
              <div className="p-2 rounded-xl bg-[#F3F0FF] border border-[#E0DCFF] text-[#7B61FF]">
                {icon}
              </div>
            )}
            {title && (
              <h2 className="text-lg font-semibold text-[#2F2F36]">{title}</h2>
            )}
          </div>

          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      <div className={content}>{children}</div>
    </div>
  );
}
