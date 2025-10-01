import { createTheme, ThemeOptions } from "@mui/material/styles";

// AutoShack Color Palette
const colors = {
  primary: {
    main: "#2E7D32", // Forest Green - represents growth and nature
    light: "#4CAF50", // Lighter green
    dark: "#1B5E20", // Darker green
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#1976D2", // Water Blue - represents irrigation and water
    light: "#42A5F5",
    dark: "#0D47A1",
    contrastText: "#ffffff",
  },
  accent: {
    main: "#FF8F00", // Warm Orange - represents sun and energy
    light: "#FFB74D",
    dark: "#E65100",
    contrastText: "#ffffff",
  },
  success: {
    main: "#4CAF50",
    light: "#81C784",
    dark: "#388E3C",
  },
  warning: {
    main: "#FF9800",
    light: "#FFB74D",
    dark: "#F57C00",
  },
  error: {
    main: "#F44336",
    light: "#EF5350",
    dark: "#D32F2F",
  },
  background: {
    default: "#FAFAFA",
    paper: "#FFFFFF",
  },
  text: {
    primary: "#212121",
    secondary: "#757575",
  },
};

// Light Theme Configuration
const lightTheme: ThemeOptions = {
  palette: {
    mode: "light",
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    background: colors.background,
    text: colors.text,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.6,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          borderRadius: 16,
          transition: "box-shadow 0.3s ease-in-out",
          "&:hover": {
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
          padding: "8px 16px",
        },
        contained: {
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          "&:hover": {
            boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.primary.main,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
  },
};

// Dark Theme Configuration
const darkTheme: ThemeOptions = {
  ...lightTheme,
  palette: {
    mode: "dark",
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    background: {
      default: "#121212",
      paper: "#1E1E1E",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#B0B0B0",
    },
  },
};

export const createAutoShackTheme = (isDarkMode: boolean = false) => {
  return createTheme(isDarkMode ? darkTheme : lightTheme);
};

export default createAutoShackTheme();
