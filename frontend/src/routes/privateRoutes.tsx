import type { JSX } from "react";

import { categoriesRoutes } from "../features/categories/routes";
import { dashboardRoutes } from "../features/dashboard/routes";
import { sheetsRoutes } from "../features/sheets/routes";
import { transactionsRoutes } from "../features/transactions/routes";

export const privateRoutes: JSX.Element[] = [
  ...dashboardRoutes,
  ...categoriesRoutes,
  ...sheetsRoutes,
  ...transactionsRoutes,
];
