import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import { loadTheme } from "./utils/theme";

export default function App() {
  useEffect(() => {
    loadTheme();
  }, []);

  return <RouterProvider router={router} />;
}
