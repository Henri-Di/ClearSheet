import type { JSX } from "react";
import { Navigate, Route } from "react-router-dom";

import Login from "../pages/Login";

export const publicRoutes: JSX.Element[] = [
  <Route key="login" path="/login" element={<Login />} />,
  <Route key="root" path="/" element={<Navigate to="/dashboard" />} />,
  <Route key="fallback" path="*" element={<Navigate to="/dashboard" replace />} />,
];
