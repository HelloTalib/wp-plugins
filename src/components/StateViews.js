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
              borderRadius: 5,
              border: "1px solid rgba(148, 163, 184, 0.06)",
              bgcolor: "rgba(26, 26, 46, 0.6)",
              minHeight: 340,
              display: "flex",
              flexDirection: "column",
              gap: 1.75,
              animation: "fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
              animationDelay: `${i * 60}ms`,
              overflow: "hidden",
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: "linear-gradient(90deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2), rgba(167,139,250,0.2))",
              },
            }}
          >
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
              <Skeleton variant="rounded" width={52} height={52} sx={{ borderRadius: 3, bgcolor: "rgba(148,163,184,0.06)" }} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="85%" sx={{ bgcolor: "rgba(148,163,184,0.06)" }} />
                <Skeleton variant="text" width="55%" sx={{ bgcolor: "rgba(148,163,184,0.04)" }} />
              </Box>
              <Skeleton variant="rounded" width={36} height={36} sx={{ borderRadius: 2.5, bgcolor: "rgba(99,102,241,0.08)" }} />
            </Box>
            <Skeleton variant="text" width="100%" sx={{ bgcolor: "rgba(148,163,184,0.05)" }} />
            <Skeleton variant="text" width="80%" sx={{ bgcolor: "rgba(148,163,184,0.04)" }} />
            <Skeleton variant="rounded" height={64} sx={{ borderRadius: 3, bgcolor: "rgba(15,23,42,0.3)" }} />
            <Box sx={{ display: "flex", gap: 0.5 }}>
              {[55, 45, 50].map((w, j) => (
                <Skeleton key={j} variant="rounded" width={w} height={24} sx={{ borderRadius: 1.5, bgcolor: "rgba(99,102,241,0.06)" }} />
              ))}
            </Box>
            <Skeleton
              variant="rounded"
              height={42}
              sx={{
                mt: "auto",
                borderRadius: 3,
                background: "linear-gradient(90deg, rgba(99,102,241,0.06), rgba(139,92,246,0.1), rgba(99,102,241,0.06))",
                backgroundSize: "200% 100%",
                animation: "shimmer 2s ease-in-out infinite",
              }}
            />
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
        borderRadius: 4,
        border: "1px solid rgba(248, 113, 113, 0.15)",
        background: "linear-gradient(135deg, rgba(239, 68, 68, 0.06) 0%, rgba(239, 68, 68, 0.02) 100%)",
        bgcolor: "rgba(26, 26, 46, 0.8)",
        mb: 3,
        animation: "fadeInUp 0.3s ease both",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
        <Typography sx={{ fontSize: "1.4rem", lineHeight: 1 }}>⚠️</Typography>
        <Box>
          <Typography variant="h6" color="error" sx={{ fontWeight: 800, mb: 0.5, fontSize: "1rem" }}>
            Something went wrong
          </Typography>
          <Typography variant="body2" sx={{ color: "error.main", mb: 2, opacity: 0.8, fontSize: "0.84rem" }}>
            {message}
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={onRetry}
            size="small"
            sx={{ borderRadius: 2.5 }}
          >
            Dismiss
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

export function EmptyState({ message, onReset }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 5, md: 8 },
        borderRadius: 5,
        border: "1px dashed rgba(99, 102, 241, 0.15)",
        textAlign: "center",
        bgcolor: "rgba(26, 26, 46, 0.5)",
        backdropFilter: "blur(12px)",
        animation: "fadeInUp 0.4s ease both",
      }}
    >
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: 4,
          background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(139, 92, 246, 0.12))",
          border: "1px solid rgba(99, 102, 241, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mx: "auto",
          mb: 3,
        }}
      >
        <Typography sx={{ fontSize: "2rem" }}>🔍</Typography>
      </Box>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5, color: "#fff" }}>
        No plugins found
      </Typography>
      <Typography variant="body1" sx={{ color: "text.secondary", mb: 3.5, maxWidth: 440, mx: "auto", lineHeight: 1.7 }}>
        {message}
      </Typography>
      <Button variant="contained" size="large" onClick={onReset} sx={{ borderRadius: 3, px: 4 }}>
        Clear filters & browse fresh
      </Button>
    </Paper>
  );
}
