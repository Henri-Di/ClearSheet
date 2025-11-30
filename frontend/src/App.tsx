import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import { loadTheme } from "./utils/theme";

import { FloatingFinanceIcons } from "./components/FloatingFinanceIcons";

export default function App() {
  useEffect(() => {
    loadTheme();
  }, []);

  return (
    <div className="relative min-h-screen z-10">
      <FloatingFinanceIcons />
      <RouterProvider router={router} />
    </div>
  );
}
