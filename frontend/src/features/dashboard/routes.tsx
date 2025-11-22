import type { JSX } from "react";
import { Route } from "react-router-dom";

import Dashboard from "../../pages/Dashboard";

export const dashboardRoutes: JSX.Element[] = [
  <Route key="dashboard" path="dashboard" element={<Dashboard />} />,
];
