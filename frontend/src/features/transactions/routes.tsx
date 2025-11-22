import type { JSX } from "react";
import { Route } from "react-router-dom";

import Transactions from "../../pages/Transactions";

export const transactionsRoutes: JSX.Element[] = [
  <Route key="transactions" path="transactions" element={<Transactions />} />,
];
