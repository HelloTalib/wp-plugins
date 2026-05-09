import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#818cf8",
      dark: "#6366f1",
      light: "#a5b4fc",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#a78bfa",
      light: "#c4b5fd",
      dark: "#8b5cf6",
    },
    success: {
      main: "#34d399",
      light: "rgba(52, 211, 153, 0.15)",
      dark: "#10b981",
    },
    warning: {
      main: "#fbbf24",
      light: "rgba(251, 191, 36, 0.15)",
      dark: "#f59e0b",
    },
    error: {
      main: "#f87171",
      light: "rgba(248, 113, 113, 0.15)",
      dark: "#ef4444",
    },
    text: {
      primary: "#f1f5f9",
      secondary: "#94a3b8",
    },
    background: {
      default: "#0f0f1a",
      paper: "#1a1a2e",
    },
    divider: "rgba(148, 163, 184, 0.08)",
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily:
      '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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
            transform: "translateY(20px) scale(0.98)",
          },
          to: {
            opacity: 1,
            transform: "translateY(0) scale(1)",
          },
        },
        "@keyframes shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
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
          minHeight: 42,
          boxShadow: "none",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:focus-visible": {
            outline: "2px solid",
            outlineColor: "#818cf8",
            outlineOffset: 2,
          },
        },
        containedPrimary: {
          background:
            "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)",
          backgroundSize: "200% 200%",
          "&:hover": {
            backgroundPosition: "100% 0",
            boxShadow:
              "0 8px 32px rgba(99, 102, 241, 0.4), 0 0 0 1px rgba(99, 102, 241, 0.2)",
            transform: "translateY(-2px)",
          },
          "&:active": {
            transform: "translateY(0px)",
          },
        },
        outlined: {
          borderWidth: "1px",
          borderColor: "rgba(148, 163, 184, 0.15)",
          "&:hover": {
            borderWidth: "1px",
            borderColor: "rgba(129, 140, 248, 0.4)",
            background: "rgba(99, 102, 241, 0.08)",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: "rgba(30, 30, 50, 0.6)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            backgroundColor: "rgba(30, 30, 50, 0.8)",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(129, 140, 248, 0.3)",
            },
          },
          "&.Mui-focused": {
            backgroundColor: "rgba(30, 30, 50, 0.9)",
            boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.15)",
          },
        },
        notchedOutline: {
          borderColor: "rgba(148, 163, 184, 0.12)",
          transition: "border-color 0.3s ease",
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
          border: "1px solid rgba(148, 163, 184, 0.08)",
          backgroundColor: "rgba(26, 26, 46, 0.8)",
          boxShadow:
            "0 4px 24px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(148, 163, 184, 0.04)",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          position: "relative",
          overflow: "hidden",
          backdropFilter: "blur(12px)",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background:
              "linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa, #c4b5fd)",
            backgroundSize: "300% 100%",
            animation: "gradientShift 4s ease infinite",
            opacity: 0.6,
          },
          "@media (hover: hover)": {
            "&:hover": {
              transform: "translateY(-8px) scale(1.01)",
              boxShadow:
                "0 20px 60px rgba(99, 102, 241, 0.15), 0 8px 24px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(129, 140, 248, 0.15)",
              borderColor: "rgba(129, 140, 248, 0.2)",
              "&::before": {
                opacity: 1,
                height: "3px",
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
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          border: "none",
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          border: "none",
          borderRadius: 8,
          margin: "0 2px",
          color: "#94a3b8",
          "&.Mui-selected": {
            backgroundColor: "rgba(99, 102, 241, 0.15)",
            color: "#818cf8",
            "&:hover": {
              backgroundColor: "rgba(99, 102, 241, 0.25)",
            },
          },
        },
      },
    },
  },
});

export default theme;
