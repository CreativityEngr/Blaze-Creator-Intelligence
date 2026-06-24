import { useEffect, useState } from "react";

export type Theme = "dark" | "light";

const storageKey = "blaze-creator-os-theme";

function getInitialTheme(): Theme {
  const storedTheme = localStorage.getItem(storageKey);
  return storedTheme === "light" ? "light" : "dark";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem(storageKey, theme);
  }, [theme]);

  return {
    theme,
    toggleTheme: () => setTheme((current) => (current === "dark" ? "light" : "dark"))
  };
}
