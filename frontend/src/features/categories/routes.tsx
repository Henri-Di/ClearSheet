import type { JSX } from "react";
import { Route } from "react-router-dom";

import Categories from "../../pages/Categories";

export const categoriesRoutes: JSX.Element[] = [
  <Route key="categories" path="categories" element={<Categories />} />,
];
