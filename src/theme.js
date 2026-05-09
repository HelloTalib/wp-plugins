import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2271b1",
      dark: "#135e96",
      light: "#e7f2fa",
    },
    secondary: {
      main: "#50575e",
      light: "#f0f0f1",
    },
    success: {
      main: "#15803d",
      light: "rgba(34,197,94,0.14)",
    },
    warning: {
      main: "#a16207",
      light: "rgba(250,204,21,0.22)",
    },
    error: {
      main: "#b91c1c",
      light: "rgba(248,113,113,0.18)",
    },
    text: {
      primary: "#1d2327",
      secondary: "#646970",
    },
    background: {
      default: "#f0f4f8",
      paper: "#ffffff",
    },
    divider: "rgba(30, 41, 59, 0.10)",
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily:
      '"DM Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h3: {
      fontWeight: 800,
      letterSpacing: "-0.03em",
      lineHeight: 1.15,
    },
    h6: {
      fontWeight: 700,
      letterSpacing: "-0.01em",
    },
    subtitle1: {
      fontWeight: 500,
      lineHeight: 1.5,
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
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          minHeight: 44,
          boxShadow: "none",
          "&:focus-visible": {
            outline: "2px solid",
            outlineColor: "primary.main",
            outlineOffset: 2,
          },
        },
        containedPrimary: {
          "&:hover": {
            boxShadow: "0 6px 18px rgba(34, 113, 177, 0.35)",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: "#fafbfc",
          transition: "background-color 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            backgroundColor: "#fff",
          },
          "&.Mui-focused": {
            backgroundColor: "#fff",
            boxShadow: "0 0 0 3px rgba(34, 113, 177, 0.18)",
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
          borderRadius: 18,
          border: "1px solid",
          borderColor: "rgba(30, 41, 59, 0.07)",
          boxShadow: "0 2px 8px rgba(15, 23, 42, 0.05), 0 8px 24px rgba(15, 23, 42, 0.06)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
          "@media (hover: hover)": {
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 8px 28px rgba(15, 23, 42, 0.1)",
              borderColor: "rgba(34, 113, 177, 0.22)",
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
