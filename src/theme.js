import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#6366f1",
      dark: "#4f46e5",
      light: "#818cf8",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#8b5cf6",
      light: "#a78bfa",
      dark: "#7c3aed",
    },
    success: {
      main: "#10b981",
      light: "rgba(16, 185, 129, 0.1)",
      dark: "#059669",
    },
    warning: {
      main: "#f59e0b",
      light: "rgba(245, 158, 11, 0.1)",
      dark: "#d97706",
    },
    error: {
      main: "#ef4444",
      light: "rgba(239, 68, 68, 0.1)",
      dark: "#dc2626",
    },
    text: {
      primary: "#0f172a",
      secondary: "#64748b",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    divider: "rgba(15, 23, 42, 0.06)",
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily:
      '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h3: {
      fontWeight: 900,
      letterSpacing: "-0.03em",
      color: "#0f172a",
    },
    h5: {
      fontWeight: 800,
      letterSpacing: "-0.02em",
    },
    h6: {
      fontWeight: 700,
      letterSpacing: "-0.01em",
    },
    subtitle1: {
      fontWeight: 700,
      lineHeight: 1.4,
    },
    body2: {
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 800,
      textTransform: "none",
      letterSpacing: "0.01em",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarGutter: "stable",
        },
        "@keyframes fadeInUp": {
          from: {
            opacity: 0,
            transform: "translateY(20px) scale(0.98)",
          },
          to: {
            opacity: 1,
            transform: "translateY(0) scale(1)",
          },
        },
        "@keyframes gradientShift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          minHeight: 44,
          boxShadow: "none",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 4px 12px rgba(15, 23, 42, 0.05)",
          },
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
            boxShadow: "0 8px 24px rgba(99, 102, 241, 0.3)",
          },
        },
        outlined: {
          borderWidth: "1.5px",
          borderColor: "rgba(15, 23, 42, 0.08)",
          "&:hover": {
            borderWidth: "1.5px",
            borderColor: "#6366f1",
            background: "rgba(99, 102, 241, 0.03)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          border: "1px solid rgba(15, 23, 42, 0.05)",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01)",
          transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 20px 40px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(99, 102, 241, 0.05)",
            borderColor: "rgba(99, 102, 241, 0.15)",
          },
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          border: "1px solid rgba(15, 23, 42, 0.05)",
          backgroundColor: "rgba(15, 23, 42, 0.02)",
          padding: 4,
          borderRadius: 14,
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          border: "none",
          borderRadius: 10,
          margin: "0 2px",
          padding: "8px 16px",
          fontWeight: 700,
          color: "#64748b",
          "&.Mui-selected": {
            backgroundColor: "#ffffff",
            color: "#6366f1",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            "&:hover": {
              backgroundColor: "#ffffff",
            },
          },
          "&:hover": {
            backgroundColor: "rgba(15, 23, 42, 0.04)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          borderRadius: 10,
        },
      },
    },
  },
});

export default theme;
