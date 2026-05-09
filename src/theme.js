import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#6366f1",
      dark: "#4338ca",
      light: "#eef2ff",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#8b5cf6",
      light: "#f5f3ff",
      dark: "#6d28d9",
    },
    success: {
      main: "#10b981",
      light: "rgba(16, 185, 129, 0.12)",
      dark: "#059669",
    },
    warning: {
      main: "#f59e0b",
      light: "rgba(245, 158, 11, 0.12)",
      dark: "#d97706",
    },
    error: {
      main: "#ef4444",
      light: "rgba(239, 68, 68, 0.12)",
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
    divider: "rgba(15, 23, 42, 0.08)",
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily:
      '"Inter", "DM Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h3: {
      fontWeight: 800,
      letterSpacing: "-0.03em",
      lineHeight: 1.15,
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
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body2: {
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 700,
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
            transform: "translateY(16px)",
          },
          to: {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
        "@keyframes shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "@keyframes pulseGlow": {
          "0%, 100%": { opacity: 0.6 },
          "50%": { opacity: 1 },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          minHeight: 42,
          boxShadow: "none",
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:focus-visible": {
            outline: "2px solid",
            outlineColor: "#6366f1",
            outlineOffset: 2,
          },
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
            boxShadow: "0 8px 25px rgba(99, 102, 241, 0.4)",
            transform: "translateY(-1px)",
          },
          "&:active": {
            transform: "translateY(0px)",
          },
        },
        outlined: {
          borderWidth: "1.5px",
          "&:hover": {
            borderWidth: "1.5px",
            background: "rgba(99, 102, 241, 0.04)",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: "#ffffff",
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            backgroundColor: "#ffffff",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(99, 102, 241, 0.4)",
            },
          },
          "&.Mui-focused": {
            backgroundColor: "#ffffff",
            boxShadow: "0 0 0 4px rgba(99, 102, 241, 0.12)",
          },
        },
        notchedOutline: {
          borderColor: "rgba(15, 23, 42, 0.12)",
          transition: "border-color 0.25s ease",
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
          borderRadius: 20,
          border: "1px solid",
          borderColor: "rgba(15, 23, 42, 0.06)",
          boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04), 0 4px 16px rgba(15, 23, 42, 0.04)",
          transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: "linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa)",
            opacity: 0,
            transition: "opacity 0.35s ease",
          },
          "@media (hover: hover)": {
            "&:hover": {
              transform: "translateY(-6px)",
              boxShadow:
                "0 12px 40px rgba(99, 102, 241, 0.12), 0 4px 16px rgba(15, 23, 42, 0.08)",
              borderColor: "rgba(99, 102, 241, 0.2)",
              "&::before": {
                opacity: 1,
              },
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;
