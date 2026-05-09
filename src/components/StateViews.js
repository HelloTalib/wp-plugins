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
              border: "1px solid rgba(15, 23, 42, 0.05)",
              minHeight: 360,
              display: "flex",
              flexDirection: "column",
              gap: 1.75,
              animation: "fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) both",
              animationDelay: `${i * 60}ms`,
              overflow: "hidden",
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: "linear-gradient(90deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2), rgba(167,139,250,0.2))",
              },
            }}
          >
            <Box sx={{ display: "flex", gap: 2 }}>
              <Skeleton
                variant="rounded"
                width={56}
                height={56}
                sx={{
                  borderRadius: 3,
                  bgcolor: "rgba(99, 102, 241, 0.06)",
                }}
              />
              <Box sx={{ flex: 1 }}>
                <Skeleton
                  variant="rounded"
                  width={28}
                  height={28}
                  sx={{ ml: "auto", mb: 0.5, borderRadius: 2, bgcolor: "rgba(99, 102, 241, 0.04)" }}
                />
                <Skeleton variant="text" width="90%" sx={{ bgcolor: "rgba(15, 23, 42, 0.06)" }} />
                <Skeleton variant="text" width="65%" sx={{ bgcolor: "rgba(15, 23, 42, 0.04)" }} />
              </Box>
            </Box>
            <Skeleton variant="text" sx={{ bgcolor: "rgba(15, 23, 42, 0.05)" }} />
            <Skeleton variant="text" width="92%" sx={{ bgcolor: "rgba(15, 23, 42, 0.04)" }} />
            <Skeleton variant="text" width="78%" sx={{ bgcolor: "rgba(15, 23, 42, 0.04)" }} />
            <Skeleton
              variant="rounded"
              height={68}
              sx={{
                borderRadius: 3,
                bgcolor: "rgba(99, 102, 241, 0.04)",
              }}
            />
            <Box sx={{ display: "flex", gap: 0.5, mt: 0.5 }}>
              {[60, 48, 52].map((w, j) => (
                <Skeleton
                  key={j}
                  variant="rounded"
                  width={w}
                  height={26}
                  sx={{ borderRadius: 2, bgcolor: "rgba(99, 102, 241, 0.04)" }}
                />
              ))}
            </Box>
            <Skeleton
              variant="rounded"
              height={44}
              sx={{
                mt: "auto",
                borderRadius: 3,
                background: "linear-gradient(90deg, rgba(99,102,241,0.06), rgba(139,92,246,0.08), rgba(99,102,241,0.06))",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s ease-in-out infinite",
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
        border: "1px solid",
        borderColor: "rgba(239, 68, 68, 0.2)",
        background: "linear-gradient(135deg, rgba(239, 68, 68, 0.04) 0%, rgba(239, 68, 68, 0.08) 100%)",
        mb: 3,
        animation: "fadeInUp 0.3s ease both",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
        <Typography sx={{ fontSize: "1.5rem", lineHeight: 1 }}>⚠️</Typography>
        <Box>
          <Typography variant="h6" color="error" sx={{ fontWeight: 800, mb: 0.5 }}>
            Something went wrong
          </Typography>
          <Typography variant="body2" color="error.dark" sx={{ mb: 2, opacity: 0.85 }}>
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
        border: "2px dashed",
        borderColor: "rgba(99, 102, 241, 0.15)",
        textAlign: "center",
        bgcolor: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(8px)",
        animation: "fadeInUp 0.4s ease both",
      }}
    >
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: 4,
          background: "linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.08))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mx: "auto",
          mb: 3,
        }}
      >
        <Typography sx={{ fontSize: "2rem" }}>🔍</Typography>
      </Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 800,
          mb: 1.5,
          background: "linear-gradient(135deg, #0f172a, #334155)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        No plugins found
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3.5, maxWidth: 440, mx: "auto", lineHeight: 1.7 }}>
        {message}
      </Typography>
      <Button
        variant="contained"
        size="large"
        onClick={onReset}
        sx={{ borderRadius: 3, px: 4 }}
      >
        Clear filters & browse fresh results
      </Button>
    </Paper>
  );
}
