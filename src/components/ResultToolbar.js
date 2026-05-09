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

  return (
    <Paper
      elevation={0}
      component="header"
      sx={{
        position: "sticky",
        top: { xs: 0, sm: 10 },
        zIndex: 24,
        mb: 2.5,
        px: { xs: 1.5, sm: 2 },
        py: { xs: 1.5, sm: 1.75 },
        borderRadius: 4,
        border: "1px solid",
        borderColor: "rgba(30, 41, 59, 0.09)",
        boxShadow: "0 2px 12px rgba(15, 23, 42, 0.06), 0 12px 28px rgba(15, 23, 42, 0.05)",
        backgroundColor: "rgba(255,255,255,0.96)",
        backdropFilter: "blur(14px)",
      }}
    >
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
          mb: 1.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, minWidth: 0 }}>
          <Box
            sx={{
              width: 4,
              borderRadius: 999,
              bgcolor: "primary.main",
              alignSelf: "stretch",
              minHeight: 44,
              flexShrink: 0,
              display: { xs: "none", sm: "block" },
              opacity: 0.9,
            }}
          />
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                letterSpacing: "-0.02em",
                lineHeight: 1.25,
                fontFeatureSettings: '"tnum"',
              }}
            >
              {`${totalPlugins.toLocaleString()} ${totalPlugins === 1 ? "plugin" : "plugins"} match`}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", mt: 0.5 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                Page {currentPage.toLocaleString()} of {totalPages.toLocaleString()}
              </Typography>
              <Chip
                size="small"
                label="Sorted locally"
                variant="outlined"
                sx={{
                  fontWeight: 600,
                  height: 24,
                  borderColor: "rgba(30, 41, 59, 0.14)",
                  bgcolor: "rgba(247, 250, 252, 0.9)",
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
              minWidth: 96,
              borderRadius: 999,
              borderColor: "rgba(30, 41, 59, 0.14)",
              color: "text.secondary",
              fontWeight: 700,
            }}
          >
            Previous
          </Button>
          <Button
            size="small"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            variant="contained"
            sx={{ flex: { xs: 1, sm: "none" }, minWidth: 96, borderRadius: 999, fontWeight: 700 }}
          >
            Next
          </Button>
        </Box>
      </Box>

      <Divider sx={{ borderColor: "rgba(30, 41, 59, 0.08)", mb: 1.5 }} />

      {/* Search strip — grouped for calmer scan */}
      <Box
        component="form"
        onSubmit={handleSearchSubmit}
        sx={{
          borderRadius: 3,
          border: "1px solid rgba(30, 41, 59, 0.08)",
          bgcolor: "rgba(241, 245, 249, 0.65)",
          p: { xs: 1.25, sm: 1.35 },
          display: "flex",
          flexDirection: "column",
          gap: 1.25,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 1,
          }}
        >
          <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 128 } }}>
            <InputLabel id="toolbar-search-type-label">By</InputLabel>
            <Select
              labelId="toolbar-search-type-label"
              value={searchType}
              label="By"
              onChange={(e) => setSearchType(e.target.value)}
              sx={{ bgcolor: "background.paper", borderRadius: 2 }}
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
              "& .MuiOutlinedInput-root": { bgcolor: "background.paper" },
            }}
            InputProps={{
              endAdornment: searchInput ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchInput("")} aria-label="Clear query">
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
              minWidth: { xs: "100%", sm: 108 },
              borderRadius: 999,
              height: 40,
              fontWeight: 700,
            }}
          >
            Search
          </Button>

          <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 164 }, ml: { sm: "auto" } }}>
            <InputLabel id="toolbar-sort-label">Sort</InputLabel>
            <Select
              labelId="toolbar-sort-label"
              value={sortOption}
              label="Sort"
              onChange={(e) => setSortOption(e.target.value)}
              sx={{ bgcolor: "background.paper", borderRadius: 2 }}
            >
              <MenuItem value="installation">Most installs</MenuItem>
              <MenuItem value="star">Highest rated</MenuItem>
              <MenuItem value="updated">Recently updated</MenuItem>
              <MenuItem value="new">Newest</MenuItem>
              <MenuItem value="old">Oldest</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
            pt: 0.25,
            borderTop: "1px dashed rgba(30, 41, 59, 0.12)",
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, letterSpacing: 0.6 }}>
            QUERY
          </Typography>
          {activeSearch ? (
            <Chip
              color="primary"
              variant="filled"
              size="small"
              label={`${activeSearch.type}: ${activeSearch.value}`}
              onDelete={clearSearch}
              sx={{ fontWeight: 700, borderRadius: 999 }}
            />
          ) : (
            <Chip
              label="Latest from directory"
              size="small"
              variant="outlined"
              sx={{
                fontWeight: 700,
                borderRadius: 999,
                borderColor: "rgba(30, 41, 59, 0.14)",
                bgcolor: "background.paper",
              }}
            />
          )}
        </Box>
      </Box>
    </Paper>
  );
}

export default ResultToolbar;
