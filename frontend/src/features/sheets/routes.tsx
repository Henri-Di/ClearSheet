import type { JSX } from "react";
import { Route } from "react-router-dom";

import SheetView from "../../pages/SheetView";
import Sheets from "../../pages/Sheets";

export const sheetsRoutes: JSX.Element[] = [
  <Route key="sheets" path="sheets" element={<Sheets />} />,
  <Route key="sheet-view" path="sheets/:id" element={<SheetView />} />,
];
