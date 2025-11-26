export function loadTheme() {
  const saved = localStorage.getItem("theme");

  if (saved === "dark") {
    document.documentElement.classList.add("dark");
    return;
  }

  if (saved === "light") {
    document.documentElement.classList.remove("dark");
    return;
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (prefersDark) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
}

export function toggleTheme() {
  const html = document.documentElement;

  const isDark = html.classList.contains("dark");

  if (isDark) {
    html.classList.remove("dark");
    localStorage.setItem("theme", "light");
  } else {
    html.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }
}
