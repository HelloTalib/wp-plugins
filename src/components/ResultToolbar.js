import React from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
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
    if (searchType === "author") return "e.g. wpxero";
    if (searchType === "plugin") return "e.g. cache";
    return "e.g. seo";
  };

  const getLabel = () => {
    if (searchType === "author") return "Author";
    if (searchType === "plugin") return "Plugin";
    return "Tag";
  };

  const searchTypeIcon = () => {
    if (searchType === "author") return "👤";
    if (searchType === "plugin") return "🧩";
    return "🏷️";
  };

  return (
    <Paper
      elevation={0}
      component="header"
      sx={{
        position: "sticky",
        top: { xs: 0, sm: 12 },
        zIndex: 24,
        mb: 3,
        borderRadius: 5,
        border: "1px solid",
        borderColor: "rgba(15, 23, 42, 0.06)",
        boxShadow: "0 4px 24px rgba(15, 23, 42, 0.06), 0 1px 4px rgba(15, 23, 42, 0.04)",
        backgroundColor: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(20px) saturate(1.5)",
        overflow: "hidden",
      }}
    >
      {/* Gradient accent bar */}
      <Box
        sx={{
          height: 3,
          background: "linear-gradient(90deg, #6366f1 0%, #8b5cf6 40%, #a78bfa 70%, #c4b5fd 100%)",
        }}
      />

      <Box sx={{ px: { xs: 2, sm: 2.5 }, pt: { xs: 2, sm: 2 }, pb: { xs: 1.75, sm: 2 } }}>
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
          Select the Best Plugin
        </Typography>

        {/* Summary + pagination */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 1.5, sm: 2 },
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0 }}>
            {/* Pulse indicator */}
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 3,
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 4px 14px rgba(99, 102, 241, 0.3)",
              }}
            >
              <Typography sx={{ fontSize: "1.25rem", lineHeight: 1 }}>🔌</Typography>
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, flexWrap: "wrap" }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    letterSpacing: "-0.025em",
                    lineHeight: 1.25,
                    fontFeatureSettings: '"tnum"',
                    background: "linear-gradient(135deg, #0f172a 0%, #334155 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {totalPlugins.toLocaleString()}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: "text.secondary",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {totalPlugins === 1 ? "plugin" : "plugins"} found
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", mt: 0.5 }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    color: "text.secondary",
                    fontFeatureSettings: '"tnum"',
                  }}
                >
                  Page {currentPage.toLocaleString()} of {totalPages.toLocaleString()}
                </Typography>
                <Chip
                  size="small"
                  label="Client-side sort"
                  sx={{
                    fontWeight: 600,
                    height: 22,
                    fontSize: "0.675rem",
                    bgcolor: "rgba(99, 102, 241, 0.08)",
                    color: "primary.dark",
                    border: "none",
                    "& .MuiChip-label": { px: 1 },
                  }}
                />
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 1, justifyContent: { xs: "stretch", sm: "flex-end" } }}>
            <Button
              size="small"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              variant="outlined"
              color="inherit"
              sx={{
                flex: { xs: 1, sm: "none" },
                minWidth: 100,
                borderRadius: 3,
                borderColor: "rgba(15, 23, 42, 0.12)",
                color: "text.secondary",
                fontWeight: 700,
                "&:hover": {
                  borderColor: "primary.main",
                  color: "primary.main",
                  bgcolor: "primary.light",
                },
              }}
            >
              ← Previous
            </Button>
            <Button
              size="small"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              variant="contained"
              sx={{
                flex: { xs: 1, sm: "none" },
                minWidth: 100,
                borderRadius: 3,
                fontWeight: 700,
              }}
            >
              Next →
            </Button>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "rgba(15, 23, 42, 0.06)", mb: 2 }} />

        {/* Search strip */}
        <Box
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{
            borderRadius: 3.5,
            border: "1px solid rgba(15, 23, 42, 0.06)",
            bgcolor: "rgba(248, 250, 252, 0.8)",
            p: { xs: 1.5, sm: 1.75 },
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 1.25,
            }}
          >
            <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 140 } }}>
              <InputLabel id="toolbar-search-type-label">Search by</InputLabel>
              <Select
                labelId="toolbar-search-type-label"
                value={searchType}
                label="Search by"
                onChange={(e) => setSearchType(e.target.value)}
                sx={{
                  bgcolor: "background.paper",
                  borderRadius: 3,
                  fontWeight: 600,
                }}
                startAdornment={
                  <InputAdornment position="start">
                    <Typography sx={{ fontSize: "0.9rem", mr: -0.5 }}>{searchTypeIcon()}</Typography>
                  </InputAdornment>
                }
              >
                <MenuItem value="author">Author</MenuItem>
                <MenuItem value="plugin">Plugin</MenuItem>
                <MenuItem value="tag">Tag</MenuItem>
              </Select>
            </FormControl>

            <TextField
              size="small"
              label={getLabel()}
              placeholder={getPlaceholder()}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              sx={{
                flex: "1 1 200px",
                minWidth: { xs: "100%", sm: 200 },
                "& .MuiOutlinedInput-root": {
                  bgcolor: "background.paper",
                  borderRadius: 3,
                },
              }}
              InputProps={{
                endAdornment: searchInput ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setSearchInput("")}
                      aria-label="Clear query"
                      sx={{
                        color: "text.secondary",
                        "&:hover": { color: "error.main" },
                      }}
                    >
                      ✕
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />

            <Button
              type="submit"
              variant="contained"
              size="medium"
              disabled={!searchInput.trim()}
              sx={{
                minWidth: { xs: "100%", sm: 120 },
                borderRadius: 3,
                height: 42,
                fontWeight: 700,
                fontSize: "0.875rem",
                gap: 0.75,
              }}
            >
              🔍 Search
            </Button>

            <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 170 }, ml: { sm: "auto" } }}>
              <InputLabel id="toolbar-sort-label">Sort by</InputLabel>
              <Select
                labelId="toolbar-sort-label"
                value={sortOption}
                label="Sort by"
                onChange={(e) => setSortOption(e.target.value)}
                sx={{
                  bgcolor: "background.paper",
                  borderRadius: 3,
                  fontWeight: 600,
                }}
              >
                <MenuItem value="installation">📊 Most installs</MenuItem>
                <MenuItem value="star">⭐ Highest rated</MenuItem>
                <MenuItem value="updated">🔄 Recently updated</MenuItem>
                <MenuItem value="new">✨ Newest</MenuItem>
                <MenuItem value="old">📅 Oldest</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Active query display */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
              pt: 1,
              borderTop: "1px solid rgba(15, 23, 42, 0.06)",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                letterSpacing: "0.08em",
                color: "text.secondary",
                textTransform: "uppercase",
                fontSize: "0.65rem",
              }}
            >
              Active Query
            </Typography>
            {activeSearch ? (
              <Chip
                color="primary"
                variant="filled"
                size="small"
                label={`${activeSearch.type}: ${activeSearch.value}`}
                onDelete={clearSearch}
                sx={{
                  fontWeight: 700,
                  borderRadius: 2,
                  height: 28,
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  "& .MuiChip-deleteIcon": {
                    color: "rgba(255,255,255,0.7)",
                    "&:hover": { color: "#fff" },
                  },
                }}
              />
            ) : (
              <Chip
                label="Latest from directory"
                size="small"
                sx={{
                  fontWeight: 600,
                  borderRadius: 2,
                  height: 28,
                  bgcolor: "rgba(99, 102, 241, 0.06)",
                  color: "primary.dark",
                  border: "1px solid rgba(99, 102, 241, 0.12)",
                }}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

export default ResultToolbar;
