"use client";

import * as React from "react";
import { Theme, ThemeContext } from "@/components/theme/useTheme";

const THEME_STORAGE_KEY = "theme";

function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

function getPreferredTheme(): Theme {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (isTheme(stored)) return stored;
  } catch {
    // ignore
  }

  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

function withTransition(fn: () => void) {
  const root = document.documentElement;
  root.classList.add("theme-transition");
  fn();
  window.setTimeout(() => root.classList.remove("theme-transition"), 250);
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = React.useState<Theme>("dark");

  React.useEffect(() => {
    // Prefer the value already applied by the inline theme script (pre-hydration).
    const fromDom = document.documentElement.dataset.theme;
    if (isTheme(fromDom)) {
      setThemeState(fromDom);
      applyTheme(fromDom);
      return;
    }

    const preferred = getPreferredTheme();
    setThemeState(preferred);
    applyTheme(preferred);
  }, []);

  const setTheme = React.useCallback((next: Theme) => {
    setThemeState(next);
    withTransition(() => applyTheme(next));
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  const toggleTheme = React.useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [setTheme, theme]);

  const value = React.useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

