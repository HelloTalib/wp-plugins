import React from "react";
import { Box, Button, Paper, Skeleton, Typography } from "@mui/material";

export function LoadingState() {
  return (
    <Box sx={{ display: "grid", gap: 2.25 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)", xl: "repeat(4, 1fr)" },
          gap: { xs: 2.25, md: 3 },
        }}
      >
        {[...Array(8)].map((_, i) => (
          <Paper
            key={i}
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 4,
              border: "1px solid rgba(30, 41, 59, 0.08)",
              minHeight: 340,
              display: "flex",
              flexDirection: "column",
              gap: 1.75,
            }}
          >
            <Box sx={{ display: "flex", gap: 2 }}>
              <Skeleton variant="rounded" width={60} height={60} sx={{ borderRadius: 2.5 }} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="32%" sx={{ ml: "auto", mb: 0.5 }} />
                <Skeleton variant="text" width="98%" />
                <Skeleton variant="text" width="72%" />
              </Box>
            </Box>
            <Skeleton variant="text" />
            <Skeleton variant="text" width="92%" />
            <Skeleton variant="text" width="85%" />
            <Skeleton variant="rounded" height={72} sx={{ borderRadius: 2.5, bgcolor: "grey.100" }} />
            <Skeleton variant="rounded" height={44} sx={{ mt: "auto", borderRadius: 999 }} />
          </Paper>
        ))}
      </Box>
    </Box>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "error.light",
        backgroundColor: "rgba(244,67,54,0.06)",
        mb: 3,
      }}
    >
      <Typography variant="h6" color="error" sx={{ fontWeight: 800 }}>
        Something went wrong
      </Typography>
      <Typography variant="body2" color="error.dark" sx={{ mt: 0.8, mb: 2 }}>
        {message}
      </Typography>
      <Button variant="contained" color="error" onClick={onRetry}>
        Dismiss
      </Button>
    </Paper>
  );
}

export function EmptyState({ message, onReset }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 4, md: 6 },
        borderRadius: 4,
        border: "1px dashed",
        borderColor: "divider",
        textAlign: "center",
        bgcolor: "rgba(255,255,255,0.65)",
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
        No plugins found
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 440, mx: "auto" }}>
        {message}
      </Typography>
      <Button variant="contained" size="large" onClick={onReset}>
        Clear filters & browse fresh results
      </Button>
    </Paper>
  );
}
