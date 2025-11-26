import type { ReactNode } from "react";

interface SkeletonProps {
  /**
   * Tailwind classes to control width, height and rounding for the placeholder.
   */
  className?: string;
  /**
   * Optional children allow stacking multiple skeleton blocks together.
   */
  children?: ReactNode;
}

export function Skeleton({ className, children }: SkeletonProps) {
  return (
    <div className="animate-pulse" role="presentation">
      <div className={["bg-[#EEE9FA] rounded-xl", className].filter(Boolean).join(" ")}>
        {children}
      </div>
    </div>
  );
}
