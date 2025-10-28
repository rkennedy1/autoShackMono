import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { createAutoShackTheme } from "./theme";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface AutoShackThemeProviderProps {
  children: ReactNode;
}

export const AutoShackThemeProvider: React.FC<AutoShackThemeProviderProps> = ({
  children,
}) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem("autoShackTheme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    // Default to system preference - handle test environment safely
    try {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch (error) {
      // Fallback for test environment or environments without matchMedia
      return false;
    }
  });

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("autoShackTheme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  const theme = createAutoShackTheme(isDarkMode);

  // Listen for system theme changes
  useEffect(() => {
    // Skip in test environment
    if (process.env.NODE_ENV === "test") {
      return;
    }

    // Check if matchMedia is available (not in test environment)
    if (typeof window !== "undefined" && window.matchMedia) {
      try {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (e: MediaQueryListEvent) => {
          // Only update if no saved preference exists
          if (!localStorage.getItem("autoShackTheme")) {
            setIsDarkMode(e.matches);
          }
        };

        if (mediaQuery && mediaQuery.addEventListener) {
          mediaQuery.addEventListener("change", handleChange);
          return () => mediaQuery.removeEventListener("change", handleChange);
        }
      } catch (error) {
        // Silently handle any matchMedia errors
        console.warn("matchMedia not available:", error);
      }
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
