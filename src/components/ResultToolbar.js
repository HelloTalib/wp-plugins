import React from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";

function ResultToolbar({
  totalPlugins,
  currentPage,
  totalPages,
  onPageChange,
  searchType,
  setSearchType,
  searchInput,
  setSearchInput,
  handleSearchSubmit,
  activeSearch,
  clearSearch,
  sortOption,
  setSortOption,
}) {
  const getPlaceholder = () => {
    if (searchType === "author") return "Search by author (e.g. automattic)...";
    if (searchType === "plugin") return "Search by plugin name (e.g. cache)...";
    return "Search by tag (e.g. seo)...";
  };

  const handleSearchTypeChange = (event, newType) => {
    if (newType !== null) {
      setSearchType(newType);
    }
  };

  return (
    <Paper
      elevation={0}
      component="header"
      sx={{
        mb: 4,
        border: "1px solid rgba(15, 23, 42, 0.05)",
        boxShadow:
          "0 12px 40px rgba(15, 23, 42, 0.06), 0 0 0 1px rgba(15, 23, 42, 0.02)",
        backgroundColor: "#ffffff",
        overflow: "hidden",
      }}
    >
      {/* Animated gradient accent */}
      <Box
        sx={{
          height: 3,
          background:
            "linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa, #c4b5fd, #8b5cf6, #6366f1)",
          backgroundSize: "300% 100%",
          animation: "gradientShift 6s ease infinite",
        }}
      />

      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography
          component="h1"
          sx={{
            position: "absolute",
            width: "1px",
            height: "1px",
            padding: 0,
            margin: "-1px",
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            whiteSpace: "nowrap",
            border: 0,
          }}
        >
          WP Plugin Explorer
        </Typography>
        {/* ── Middle Row: Search & Type Toggle ── */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: 2.5,
            alignItems: { xs: "stretch", lg: "center" },
          }}
        >
          {/* Segmented Control for Search Type */}
          <Box sx={{ flexShrink: 0 }}>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mb: 0.75,
                fontWeight: 800,
                color: "text.secondary",
                ml: 1,
              }}
            >
              SEARCH BY
            </Typography>
            <ToggleButtonGroup
              value={searchType}
              exclusive
              onChange={handleSearchTypeChange}
              size="medium"
              sx={{
                bgcolor: "rgba(15, 23, 42, 0.03)",
                p: 0.5,
                borderRadius: 4,
                width: "100%",
                "& .MuiToggleButton-root": {
                  flex: 1,
                  border: "none",
                  borderRadius: 3,
                  py: 1,
                  px: { xs: 1, sm: 2.5 },
                  fontWeight: 800,
                  fontSize: "0.8rem",
                  textTransform: "none",
                  color: "text.secondary",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&.Mui-selected": {
                    bgcolor: "#ffffff",
                    color: "primary.main",
                    boxShadow: "0 2px 8px rgba(15, 23, 42, 0.08)",
                  },
                },
              }}
            >
              <ToggleButton value="author">Author</ToggleButton>
              <ToggleButton value="plugin">Plugin</ToggleButton>
              <ToggleButton value="tag">Tag</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Integrated Search Input */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mb: 0.75,
                fontWeight: 800,
                color: "text.secondary",
                ml: 1,
              }}
            >
              KEYWORD
            </Typography>
            <Box
              component="form"
              onSubmit={handleSearchSubmit}
              sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
            >
              <TextField
                fullWidth
                placeholder={getPlaceholder()}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 4,
                    bgcolor: "rgba(15, 23, 42, 0.02)",
                    height: 52,
                    pr: 1,
                    "& fieldset": { borderColor: "rgba(15, 23, 42, 0.06)" },
                    "&:hover fieldset": {
                      borderColor: "rgba(99, 102, 241, 0.3)",
                    },
                    "&.Mui-focused fieldset": { borderColor: "#6366f1" },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography
                        sx={{ ml: 1, opacity: 0.4, fontSize: "1.2rem" }}
                      >
                        🔍
                      </Typography>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      {searchInput && (
                        <IconButton
                          size="small"
                          onClick={() => setSearchInput("")}
                          sx={{
                            mr: 1,
                            color: "text.secondary",
                            "&:hover": { color: "error.main" },
                          }}
                        >
                          ✕
                        </IconButton>
                      )}
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={!searchInput.trim()}
                        sx={{
                          borderRadius: 3,
                          height: 38,
                          px: 3,
                        }}
                      >
                        SEARCH
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>

          {/* Mini Pagination */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              alignSelf: { xs: "center", lg: "flex-end" },
              pb: 0.5,
            }}
          >
            <Box sx={{ textAlign: "right", mr: 1 }}>
              <Typography
                sx={{
                  color: "text.primary",
                  fontWeight: 900,
                  fontSize: "0.95rem",
                  lineHeight: 1,
                }}
              >
                {currentPage}{" "}
                <Box
                  component="span"
                  sx={{ color: "text.secondary", fontWeight: 600, mx: 0.5 }}
                >
                  /
                </Box>{" "}
                {totalPages}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                PAGE
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                sx={{
                  bgcolor: "#ffffff",
                  border: "1px solid rgba(15, 23, 42, 0.08)",
                  borderRadius: 2.5,
                  p: 1.25,
                  "&:hover": {
                    bgcolor: "rgba(99, 102, 241, 0.05)",
                    borderColor: "primary.main",
                  },
                }}
              >
                <Typography sx={{ fontSize: "1rem", color: "text.secondary" }}>
                  ←
                </Typography>
              </IconButton>
              <IconButton
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                sx={{
                  bgcolor: "#ffffff",
                  border: "1px solid rgba(15, 23, 42, 0.08)",
                  borderRadius: 2.5,
                  p: 1.25,
                  "&:hover": {
                    bgcolor: "rgba(99, 102, 241, 0.05)",
                    borderColor: "primary.main",
                  },
                }}
              >
                <Typography sx={{ fontSize: "1rem", color: "text.secondary" }}>
                  →
                </Typography>
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* ── Bottom Bar: Filter Status & Sort ── */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: { xs: 1.5, sm: 0 },
            mt: 3,
            pt: 2,
            borderTop: "1px solid rgba(15, 23, 42, 0.04)",
          }}
        >
          {/* Plugin count */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 3,
                background:
                  "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.05))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(99, 102, 241, 0.1)",
                flexShrink: 0,
              }}
            >
              <Typography sx={{ fontSize: "1.4rem" }}>🔌</Typography>
            </Box>
            <Box>
              <Typography
                sx={{
                  fontWeight: 900,
                  fontSize: "1.25rem",
                  color: "text.primary",
                  lineHeight: 1,
                  fontFeatureSettings: '"tnum"',
                }}
              >
                {totalPlugins.toLocaleString()}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  color: "text.secondary",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Plugins Found
              </Typography>
            </Box>
          </Box>

          {/* Filter chip + Sort — stacked on xs, inline on sm+ */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1.5,
              width: { xs: "100%", sm: "auto" },
            }}
          >
            {activeSearch ? (
              <Chip
                label={`${activeSearch.type}: ${activeSearch.value}`}
                onDelete={clearSearch}
                sx={{
                  fontWeight: 800,
                  borderRadius: 2,
                  height: 28,
                  fontSize: "0.75rem",
                  background:
                    "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  color: "#fff",
                }}
              />
            ) : (
              <Chip
                label="Latest Directory"
                size="small"
                sx={{
                  fontWeight: 700,
                  borderRadius: 2,
                  bgcolor: "rgba(15, 23, 42, 0.04)",
                  color: "text.secondary",
                  border: "1px solid rgba(15, 23, 42, 0.05)",
                }}
              />
            )}

            <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 180 } }}>
              <Select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                sx={{
                  borderRadius: 3,
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  bgcolor: "rgba(15, 23, 42, 0.02)",
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid rgba(15, 23, 42, 0.05)",
                  },
                }}
              >
                <MenuItem value="installation">📊 Most Installs</MenuItem>
                <MenuItem value="star">⭐ Highest Rated</MenuItem>
                <MenuItem value="updated">🔄 Recently Updated</MenuItem>
                <MenuItem value="new">✨ Newest</MenuItem>
                <MenuItem value="old">📅 Oldest</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

export default ResultToolbar;
