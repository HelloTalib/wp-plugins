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

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderColor: "rgba(30, 41, 59, 0.07)",
      }}
    >
      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          pt: 2.5,
          pb: 2.25,
          px: 2.5,
        }}
      >
        {/* Icon + title + rank/version */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", mb: 1.75 }}>
          <Box
            sx={{
              width: 60,
              height: 60,
              flexShrink: 0,
              borderRadius: 2.5,
              border: "1px solid rgba(30, 41, 59, 0.08)",
              bgcolor: "#f8fafc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.85)",
            }}
          >
            <CardMedia
              component="img"
              sx={{ width: 44, height: 44, objectFit: "contain" }}
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
                mb: 0.75,
              }}
            >
              <Typography
                variant="subtitle1"
                component="h2"
                sx={{
                  fontWeight: 800,
                  color: "primary.dark",
                  lineHeight: 1.35,
                  letterSpacing: "-0.015em",
                  flex: 1,
                  minWidth: 0,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {decode(plugin.name)}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.5, flexShrink: 0 }}>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 800, color: "text.secondary", opacity: 0.65, fontFeatureSettings: '"tnum"' }}
                >
                  #{rank}
                </Typography>
                <Chip
                  label={version}
                  size="small"
                  variant="outlined"
                  sx={{
                    height: 24,
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    borderColor: "rgba(30, 41, 59, 0.12)",
                    bgcolor: "rgba(255,255,255,0.95)",
                    "& .MuiChip-label": { px: 0.9 },
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>

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
            fontSize: "0.875rem",
          }}
        >
          {decode(plugin.short_description)}
        </Typography>

        {/* Grouped metrics — reads as one scan block */}
        <Box
          sx={{
            borderRadius: 2.5,
            bgcolor: "rgba(248, 250, 252, 0.95)",
            border: "1px solid rgba(30, 41, 59, 0.07)",
            px: 1.35,
            py: 1.15,
            mb: 1.75,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: { xs: 1.25, sm: 1.5 },
              rowGap: 1,
            }}
          >
            {displayRating > 0 ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.65 }}>
                <Box sx={{ display: "flex", alignItems: "center", lineHeight: 1 }} aria-hidden>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Typography
                      key={i}
                      component="span"
                      sx={{
                        fontSize: "1rem",
                        color: i <= fullStars ? "#ca8a04" : "#e2e8f0",
                        mr: -0.25,
                      }}
                    >
                      ★
                    </Typography>
                  ))}
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 800, fontFeatureSettings: '"tnum"' }}>
                  {displayRating.toFixed(1)}
                </Typography>
              </Box>
            ) : (
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                No ratings yet
              </Typography>
            )}

            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
              {formatActiveInstalls(plugin.active_installs)}{" "}
              <Box component="span" sx={{ fontWeight: 600, opacity: 0.85 }}>
                active installs
              </Box>
            </Typography>

            <Typography
              component="span"
              variant="body2"
              sx={{
                fontWeight: 800,
                color: updatedMeta.color,
                bgcolor: updatedMeta.bg,
                px: 1.1,
                py: 0.45,
                borderRadius: 999,
                fontSize: "0.8125rem",
              }}
            >
              {updatedLabel}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
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
              fontWeight: 800,
              color: "primary.main",
              fontSize: "0.8125rem",
              "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
            }}
          >
            @{username}
          </Button>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
            Age · {calculatePluginAge(plugin.added)}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", mb: 2, minHeight: 28 }}>
          {plugin.tags &&
            Object.keys(plugin.tags)
              .slice(0, 3)
              .map((tagKey) => (
                <Chip
                  key={tagKey}
                  size="small"
                  variant="outlined"
                  label={plugin.tags[tagKey]}
                  onClick={() => onTagClick(plugin.tags[tagKey])}
                  sx={{
                    fontWeight: 700,
                    height: 26,
                    fontSize: "0.72rem",
                    borderColor: "rgba(30, 41, 59, 0.12)",
                    bgcolor: "rgba(255,255,255,0.92)",
                    "&:hover": { bgcolor: "primary.light", borderColor: "primary.light" },
                  }}
                />
              ))}
        </Box>

        <Button
          variant="contained"
          fullWidth
          href={`https://wordpress.org/plugins/${plugin.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            mt: "auto",
            py: 1.35,
            borderRadius: 999,
            fontWeight: 800,
            fontSize: "0.9rem",
          }}
        >
          View on WordPress.org
        </Button>
      </CardContent>
    </Card>
  );
}

export default PluginCard;
