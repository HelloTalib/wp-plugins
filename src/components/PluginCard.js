import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
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
      ? "Updated date unavailable"
      : rawUpdated === "Just now"
        ? "Updated just now"
        : `Updated ${rawUpdated}`;

  const fullStars = Math.floor(displayRating);
  const version = plugin.version ? `v${plugin.version}` : "—";

  const decode = (str = "") =>
    String(str)
      .replace(/&#8211;/g, "-")
      .replace(/&#8217;/g, "'")
      .replace(/&amp;/g, "&");

  const installsFormatted = formatActiveInstalls(plugin.active_installs);

  // Rating bar percentage
  const ratingPct = Math.min(100, (displayRating / 5) * 100);

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "visible",
        animation: "fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) both",
        animationDelay: animationDelay ? `${animationDelay}ms` : "0ms",
      }}
    >
      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          pt: 3,
          pb: 2.5,
          px: 2.5,
          "&:last-child": { pb: 2.5 },
        }}
      >
        {/* Header: Icon + title + rank/version */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", mb: 2 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              flexShrink: 0,
              borderRadius: 3,
              border: "1px solid rgba(15, 23, 42, 0.06)",
              bgcolor: "#f8fafc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(15, 23, 42, 0.06)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 4px 16px rgba(99, 102, 241, 0.15)",
              },
            }}
          >
            <CardMedia
              component="img"
              sx={{ width: 40, height: 40, objectFit: "contain" }}
              image={
                plugin.icons?.["2x"] ||
                plugin.icons?.["1x"] ||
                plugin.icons?.default ||
                "https://s.w.org/plugins/geopattern-icon/classic-widgets.svg"
              }
              alt=""
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 1,
                mb: 0.5,
              }}
            >
              <Typography
                variant="subtitle1"
                component="h2"
                sx={{
                  fontWeight: 700,
                  color: "text.primary",
                  lineHeight: 1.3,
                  letterSpacing: "-0.015em",
                  flex: 1,
                  minWidth: 0,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  fontSize: "0.95rem",
                }}
              >
                {decode(plugin.name)}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.5, flexShrink: 0 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 28,
                    height: 28,
                    borderRadius: 2,
                    bgcolor: "rgba(99, 102, 241, 0.06)",
                    border: "1px solid rgba(99, 102, 241, 0.1)",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 800,
                      color: "primary.main",
                      fontSize: "0.7rem",
                      fontFeatureSettings: '"tnum"',
                      lineHeight: 1,
                    }}
                  >
                    {rank}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Chip
              label={version}
              size="small"
              sx={{
                height: 22,
                fontWeight: 700,
                fontSize: "0.68rem",
                borderRadius: 1.5,
                bgcolor: "rgba(15, 23, 42, 0.04)",
                color: "text.secondary",
                "& .MuiChip-label": { px: 0.8 },
              }}
            />
          </Box>
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            flex: 1,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: 1.65,
            fontSize: "0.84rem",
            letterSpacing: "0.005em",
          }}
        >
          {decode(plugin.short_description)}
        </Typography>

        {/* Metrics block */}
        <Box
          sx={{
            borderRadius: 3,
            bgcolor: "rgba(248, 250, 252, 0.95)",
            border: "1px solid rgba(15, 23, 42, 0.05)",
            px: 1.5,
            py: 1.25,
            mb: 2,
          }}
        >
          {/* Rating row */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            {displayRating > 0 ? (
              <>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", lineHeight: 1 }} aria-hidden>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Typography
                        key={i}
                        component="span"
                        sx={{
                          fontSize: "0.85rem",
                          color: i <= fullStars ? "#f59e0b" : "#e2e8f0",
                          mr: -0.15,
                          transition: "color 0.2s",
                        }}
                      >
                        ★
                      </Typography>
                    ))}
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 800, fontFeatureSettings: '"tnum"', color: "text.primary" }}
                  >
                    {displayRating.toFixed(1)}
                  </Typography>
                </Box>
                {/* Rating progress bar */}
                <Box
                  sx={{
                    flex: 1,
                    height: 4,
                    borderRadius: 999,
                    bgcolor: "rgba(15, 23, 42, 0.06)",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      width: `${ratingPct}%`,
                      height: "100%",
                      borderRadius: 999,
                      background: ratingPct >= 80
                        ? "linear-gradient(90deg, #10b981, #34d399)"
                        : ratingPct >= 60
                          ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
                          : "linear-gradient(90deg, #ef4444, #f87171)",
                      transition: "width 0.6s ease",
                    }}
                  />
                </Box>
              </>
            ) : (
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                No ratings yet
              </Typography>
            )}
          </Box>

          {/* Installs + updated row */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Typography sx={{ fontSize: "0.8rem" }}>📥</Typography>
              <Typography
                variant="caption"
                sx={{ fontWeight: 700, color: "text.primary", fontFeatureSettings: '"tnum"' }}
              >
                {installsFormatted}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                installs
              </Typography>
            </Box>

            <Chip
              size="small"
              label={updatedLabel}
              sx={{
                fontWeight: 700,
                height: 24,
                fontSize: "0.7rem",
                borderRadius: 2,
                bgcolor: updatedMeta.bg,
                color: updatedMeta.color,
                border: `1px solid ${updatedMeta.color}22`,
                "& .MuiChip-label": { px: 1 },
              }}
            />
          </Box>
        </Box>

        {/* Author + Age row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 0.75,
            mb: 1.5,
          }}
        >
          <Button
            variant="text"
            size="small"
            onClick={() => onAuthorClick(username)}
            sx={{
              p: 0,
              minWidth: 0,
              fontWeight: 700,
              color: "primary.main",
              fontSize: "0.8rem",
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
                width: 20,
                height: 20,
                borderRadius: 999,
                bgcolor: "primary.light",
                fontSize: "0.65rem",
                fontWeight: 800,
                color: "primary.dark",
              }}
            >
              {username.charAt(0).toUpperCase()}
            </Box>
            @{username}
          </Button>
          <Chip
            size="small"
            label={`Age: ${calculatePluginAge(plugin.added)}`}
            sx={{
              height: 22,
              fontSize: "0.68rem",
              fontWeight: 600,
              bgcolor: "rgba(15, 23, 42, 0.03)",
              color: "text.secondary",
              "& .MuiChip-label": { px: 0.8 },
            }}
          />
        </Box>

        {/* Tags */}
        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 2, minHeight: 26 }}>
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
                    fontWeight: 600,
                    height: 26,
                    fontSize: "0.72rem",
                    borderRadius: 2,
                    bgcolor: "rgba(99, 102, 241, 0.06)",
                    color: "primary.dark",
                    border: "1px solid rgba(99, 102, 241, 0.1)",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: "primary.light",
                      borderColor: "primary.main",
                      transform: "translateY(-1px)",
                    },
                  }}
                />
              ))}
        </Box>

        {/* CTA */}
        <Button
          variant="contained"
          fullWidth
          href={`https://wordpress.org/plugins/${plugin.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            mt: "auto",
            py: 1.25,
            borderRadius: 3,
            fontWeight: 700,
            fontSize: "0.85rem",
            letterSpacing: "0.01em",
            gap: 0.75,
          }}
        >
          View on WordPress.org
          <Box component="span" sx={{ fontSize: "0.9rem", ml: 0.25 }}>→</Box>
        </Button>
      </CardContent>
    </Card>
  );
}

export default PluginCard;
