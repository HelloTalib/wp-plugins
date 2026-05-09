import React from "react";
import { Box, Button, Paper, Typography, CircularProgress } from "@mui/material";

function StateContainer({ children, sx = {} }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "400px",
        p: 4,
        textAlign: "center",
        animation: "fadeInUp 0.6s ease-out both",
        ...sx,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 5,
          borderRadius: 6,
          bgcolor: "#ffffff",
          border: "1px solid rgba(15, 23, 42, 0.05)",
          boxShadow: "0 20px 50px rgba(15, 23, 42, 0.05)",
          maxWidth: 500,
          width: "100%",
        }}
      >
        {children}
      </Paper>
    </Box>
  );
}

export function LoadingState() {
  return (
    <StateContainer>
      <Box sx={{ position: "relative", width: 80, height: 80, mb: 3, mx: "auto" }}>
        <CircularProgress
          size={80}
          thickness={4}
          sx={{
            color: "rgba(99, 102, 241, 0.1)",
          }}
        />
        <CircularProgress
          size={80}
          thickness={4}
          sx={{
            color: "primary.main",
            position: "absolute",
            left: 0,
            "& .MuiCircularProgress-circle": {
              strokeLinecap: "round",
            },
          }}
        />
      </Box>
      <Typography variant="h6" color="text.primary" gutterBottom sx={{ fontWeight: 800 }}>
        Loading Plugins...
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
        Fetching the latest data from WordPress.org
      </Typography>
    </StateContainer>
  );
}

export function EmptyState({ message = "No plugins found matching your criteria.", onClear }) {
  return (
    <StateContainer>
      <Typography sx={{ fontSize: "3rem", mb: 2 }}>🔍</Typography>
      <Typography variant="h6" color="text.primary" gutterBottom sx={{ fontWeight: 800 }}>
        No Results Found
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontWeight: 500 }}>
        {message}
      </Typography>
      <Button
        variant="outlined"
        onClick={onClear || (() => window.location.reload())}
        sx={{ borderRadius: 3, px: 4 }}
      >
        Clear All Filters
      </Button>
    </StateContainer>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <StateContainer sx={{ minHeight: "200px", mb: 4 }}>
      <Typography sx={{ fontSize: "2.5rem", mb: 2 }}>⚠️</Typography>
      <Typography variant="h6" color="error.main" gutterBottom sx={{ fontWeight: 800 }}>
        Something went wrong
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontWeight: 500 }}>
        {message}
      </Typography>
      {onRetry && (
        <Button
          variant="contained"
          color="error"
          onClick={onRetry}
          sx={{ borderRadius: 3, px: 4, bgcolor: "error.main" }}
        >
          Try Again
        </Button>
      )}
    </StateContainer>
  );
}
