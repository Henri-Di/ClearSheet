import type { ReactNode } from "react";
import { Card } from "./Card";

interface ChartCardProps {
  title: string;
  icon?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}

export function ChartCard({ title, icon, actions, children }: ChartCardProps) {
  return (
    <Card title={title} icon={icon} actions={actions} className="shadow-lg">
      {children}
    </Card>
  );
}
