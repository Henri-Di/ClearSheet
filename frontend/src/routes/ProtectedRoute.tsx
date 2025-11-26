// src/routes/ProtectedRoute.tsx
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import type { JSX } from "react";

interface Props {
  children: JSX.Element;
}

export function ProtectedRoute({ children }: Props) {
  const [checking, setChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    let token = localStorage.getItem("token");

    if (typeof token === "string") {
      token = token.replace(/^"|"$/g, "").trim();

      // Sanctum tokens reais têm no mínimo 30 caracteres
      if (token.length >= 30) {
        setIsAuth(true);
      }
    }

    setChecking(false);
  }, []);

  if (checking) return null;

  if (!isAuth) return <Navigate to="/login" replace />;

  return children;
}
