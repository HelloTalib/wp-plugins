import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  LinearProgress,
  Typography,
} from "@mui/material";

function PluginCard({
  plugin,
  rank,
  formatActiveInstalls,
  calculatePluginAge,
  calculateLastUpdated,
  getUpdatedMeta,
  onAuthorClick,
  onTagClick,
  animationDelay,
}) {
  const username = plugin.author_profile
    ? plugin.author_profile.split("/").filter(Boolean).pop()
    : "Unknown";

  const displayRating = plugin.rating ? (plugin.rating / 100) * 5 : 0;
  const updatedMeta = getUpdatedMeta(plugin.last_updated);
  const rawUpdated = calculateLastUpdated(plugin.last_updated);
  const updatedLabel =
    rawUpdated === "Invalid date"
      ? "Unknown"
      : rawUpdated === "Just now"
        ? "Just now"
        : rawUpdated;

  const version = plugin.version ? `v${plugin.version}` : "—";

  const decode = (str = "") =>
    String(str)
      .replace(/&#8211;/g, "-")
      .replace(/&#8217;/g, "'")
      .replace(/&amp;/g, "&");

  const installsFormatted = formatActiveInstalls(plugin.active_installs);
  const ratingPct = Math.min(100, (displayRating / 5) * 100);
  const age = calculatePluginAge(plugin.added);

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "visible",
        animation: "fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
        animationDelay: animationDelay ? `${animationDelay}ms` : "0ms",
      }}
    >
      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          p: 0,
          "&:last-child": { pb: 0 },
        }}
      >
        {/* Top section with icon, title, rank */}
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            alignItems: "flex-start",
            p: 2.5,
            pb: 2,
          }}
        >
          {/* Plugin icon */}
          <Box
            sx={{
              width: 52,
              height: 52,
              flexShrink: 0,
              borderRadius: 3,
              background: "linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(139,92,246,0.04) 100%)",
              border: "1px solid rgba(15, 23, 42, 0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              transition: "all 0.3s ease",
            }}
          >
            <CardMedia
              component="img"
              sx={{ width: 36, height: 36, objectFit: "contain" }}
              image={
                plugin.icons?.["2x"] ||
                plugin.icons?.["1x"] ||
                plugin.icons?.default ||
                "https://s.w.org/plugins/geopattern-icon/classic-widgets.svg"
              }
              alt=""
            />
          </Box>

          {/* Title + version */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle1"
              component="h2"
              sx={{
                fontWeight: 800,
                color: "text.primary",
                lineHeight: 1.3,
                letterSpacing: "-0.02em",
                fontSize: "0.95rem",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                mb: 0.5,
              }}
            >
              {decode(plugin.name)}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <Chip
                label={version}
                size="small"
                sx={{
                  height: 20,
                  fontWeight: 800,
                  fontSize: "0.65rem",
                  borderRadius: 1.5,
                  bgcolor: "rgba(15, 23, 42, 0.04)",
                  color: "text.secondary",
                  border: "1px solid rgba(15, 23, 42, 0.02)",
                  "& .MuiChip-label": { px: 0.75 },
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  opacity: 0.7,
                }}
              >
                {age === "New" ? "🆕 New" : age === "Unknown age" ? "Age unknown" : `${age} old`}
              </Typography>
            </Box>
          </Box>

          {/* Rank badge — links to WPMonitor stats */}
          <Box
            component="a"
            href={`https://wpmonitor.dev/plugins/${plugin.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            title="View stats on WPMonitor"
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2.5,
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.25)",
              textDecoration: "none",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": {
                transform: "scale(1.1)",
                boxShadow: "0 6px 18px rgba(99, 102, 241, 0.4)",
              },
            }}
          >
            <Typography
              sx={{
                fontWeight: 900,
                color: "#fff",
                fontSize: "0.75rem",
                fontFeatureSettings: '"tnum"',
                lineHeight: 1,
              }}
            >
              #{rank}
            </Typography>
          </Box>
        </Box>

        {/* Description */}
        <Box sx={{ px: 2.5, mb: 2 }}>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              lineHeight: 1.6,
              fontSize: "0.82rem",
              fontWeight: 500,
            }}
          >
            {decode(plugin.short_description)}
          </Typography>
        </Box>

        {/* Stats bar */}
        <Box
          sx={{
            mx: 2.5,
            mb: 2,
            borderRadius: 3,
            bgcolor: "rgba(15, 23, 42, 0.02)",
            border: "1px solid rgba(15, 23, 42, 0.04)",
            overflow: "hidden",
          }}
        >
          {/* Rating row */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1.5,
              py: 1,
              borderBottom: "1px solid rgba(15, 23, 42, 0.04)",
            }}
          >
            {displayRating > 0 ? (
              <>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: 72 }}>
                  <Typography sx={{ fontSize: "0.85rem", lineHeight: 1 }}>⭐</Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 800,
                      fontFeatureSettings: '"tnum"',
                      color: "#d97706",
                      fontSize: "0.8rem",
                    }}
                  >
                    {displayRating.toFixed(1)}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={ratingPct}
                  sx={{
                    flex: 1,
                    height: 5,
                    borderRadius: 999,
                    bgcolor: "rgba(15, 23, 42, 0.06)",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 999,
                      background:
                        ratingPct >= 80
                          ? "linear-gradient(90deg, #10b981, #34d399)"
                          : ratingPct >= 60
                            ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
                            : "linear-gradient(90deg, #ef4444, #f87171)",
                    },
                  }}
                />
              </>
            ) : (
              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, fontSize: "0.72rem", py: 0.2 }}>
                No ratings yet
              </Typography>
            )}
          </Box>

          {/* Installs + Updated row */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 1.5,
              py: 0.85,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Typography sx={{ fontSize: "0.72rem", lineHeight: 1 }}>📥</Typography>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 800,
                  color: "primary.main",
                  fontFeatureSettings: '"tnum"',
                  fontSize: "0.75rem",
                }}
              >
                {installsFormatted}
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontWeight: 600, color: "text.secondary", fontSize: "0.68rem" }}
              >
                installs
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                px: 1,
                py: 0.3,
                borderRadius: 1.5,
                bgcolor: `${updatedMeta.color}12`,
              }}
            >
              <Box
                sx={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  bgcolor: updatedMeta.color,
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 800,
                  color: updatedMeta.color,
                  fontSize: "0.68rem",
                  fontFeatureSettings: '"tnum"',
                }}
              >
                {updatedLabel}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Author */}
        <Box sx={{ px: 2.5, mb: 1.5 }}>
          <Button
            variant="text"
            size="small"
            onClick={() => onAuthorClick(username)}
            sx={{
              p: 0,
              minWidth: 0,
              fontWeight: 800,
              color: "primary.main",
              fontSize: "0.78rem",
              gap: 0.5,
              "&:hover": {
                bgcolor: "transparent",
                color: "primary.dark",
              },
            }}
          >
            <Box
              component="span"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 22,
                height: 22,
                borderRadius: 1.5,
                background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.08))",
                fontSize: "0.65rem",
                fontWeight: 900,
                color: "primary.main",
                border: "1px solid rgba(99, 102, 241, 0.1)",
              }}
            >
              {username.charAt(0).toUpperCase()}
            </Box>
            @{username}
          </Button>
        </Box>

        {/* Tags */}
        <Box sx={{ px: 2.5, display: "flex", gap: 0.5, flexWrap: "wrap", mb: 2, minHeight: 26 }}>
          {plugin.tags &&
            Object.keys(plugin.tags)
              .slice(0, 3)
              .map((tagKey) => (
                <Chip
                  key={tagKey}
                  size="small"
                  label={plugin.tags[tagKey]}
                  onClick={() => onTagClick(plugin.tags[tagKey])}
                  sx={{
                    fontWeight: 700,
                    height: 24,
                    fontSize: "0.68rem",
                    borderRadius: 1.5,
                    bgcolor: "rgba(99, 102, 241, 0.05)",
                    color: "primary.main",
                    border: "1px solid rgba(99, 102, 241, 0.08)",
                    transition: "all 0.25s ease",
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: "rgba(99, 102, 241, 0.1)",
                      borderColor: "rgba(99, 102, 241, 0.2)",
                      transform: "translateY(-1px)",
                    },
                  }}
                />
              ))}
        </Box>


        {/* CTA Button */}
        <Box sx={{ px: 2.5, pb: 2.5, mt: "auto" }}>
          <Button
            variant="contained"
            fullWidth
            href={`https://wordpress.org/plugins/${plugin.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              py: 1.2,
              borderRadius: 3,
              fontWeight: 700,
              fontSize: "0.84rem",
              letterSpacing: "0.01em",
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)",
              backgroundSize: "200% 200%",
              transition: "all 0.4s ease",
              "&:hover": {
                backgroundPosition: "100% 0",
                boxShadow: "0 8px 32px rgba(99, 102, 241, 0.35)",
                transform: "translateY(-2px)",
              },
            }}
          >
            View on WordPress.org →
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default PluginCard;
