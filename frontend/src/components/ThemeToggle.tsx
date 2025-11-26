import { Moon, Sun } from "lucide-react";
import { toggleTheme } from "../utils/theme";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const obs = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => obs.disconnect();
  }, []);

  return (
    <button
      onClick={toggleTheme}
      className="
        flex items-center gap-2 px-4 py-2 rounded-2xl
        border border-light-border bg-white shadow-sm
        hover:shadow-md hover:-translate-y-0.5 transition-all

        dark:bg-dark-card dark:text-dark-text dark:border-dark-border
      "
    >
      {isDark ? (
        <>
          <Sun size={18} />
          <span>Modo Claro</span>
        </>
      ) : (
        <>
          <Moon size={18} />
          <span>Modo Escuro</span>
        </>
      )}
    </button>
  );
}
