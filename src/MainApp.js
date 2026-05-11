import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Container, CssBaseline, ThemeProvider, Typography } from "@mui/material";
import ResultToolbar from "./components/ResultToolbar";
import PluginGrid from "./components/PluginGrid";
import PaginationBar from "./components/PaginationBar";
import { EmptyState, ErrorState, LoadingState } from "./components/StateViews";
import theme from "./theme";
import { loadPersistedUi, savePersistedUi } from "./uiPersistence";

const API_BASE_URL = "https://api.wordpress.org/plugins/info/1.2/";
const MAX_PAGE = 999;
const MIN_PER_PAGE = 24;
const MAX_PER_PAGE = 100;

const initialUi = loadPersistedUi();

function MainApp() {
  const [plugins, setPlugins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [author, setAuthor] = useState(initialUi?.author ?? "");
  const [pluginName, setPluginName] = useState(initialUi?.pluginName ?? "");
  const [tagName, setTagName] = useState(initialUi?.tagName ?? "");
  const [totalPlugins, setTotalPlugins] = useState(0);
  const [error, setError] = useState(null);
  const [searchType, setSearchType] = useState(initialUi?.searchType ?? "author");
  const [searchInput, setSearchInput] = useState(initialUi?.searchInput ?? "");
  const [currentPage, setCurrentPage] = useState(initialUi?.currentPage ?? 1);
  const [totalPages, setTotalPages] = useState(1);
  const [jumpPage, setJumpPage] = useState("");
  const [sortOption, setSortOption] = useState(initialUi?.sortOption ?? "installation");

  useEffect(() => {
    savePersistedUi({
      searchType,
      searchInput,
      author,
      pluginName,
      tagName,
      sortOption,
      currentPage,
    });
  }, [searchType, searchInput, author, pluginName, tagName, sortOption, currentPage]);

  const calculatePerPage = useCallback((totalItems, targetMaxPages = MAX_PAGE) => {
    if (!totalItems) return MIN_PER_PAGE;
    const minItemsPerPage = Math.ceil(totalItems / targetMaxPages);
    return Math.min(MAX_PER_PAGE, Math.ceil(Math.max(MIN_PER_PAGE, minItemsPerPage) / 10) * 10);
  }, []);

  const parseWpDate = useCallback((dateString) => {
    if (!dateString) return null;

    // WP API `last_updated` comes in two formats:
    // "2025-11-09 4:31am GMT"  → strip meridiem marker and turn "GMT" into "UTC"
    // "2025-11-09 04:31:00"    → already looks local — treat as UTC by appending Z
    // "2025-11-09"             → date-only (for `added`) — treat as UTC midnight
    let s = String(dateString).trim();

    // Format: "2025-11-09 4:31am GMT" or "... pm GMT"
    const gmtRe = /^(\d{4}-\d{2}-\d{2})\s+(\d{1,2}):(\d{2})(am|pm)\s*GMT$/i;
    const gmtMatch = s.match(gmtRe);
    if (gmtMatch) {
      let hours = parseInt(gmtMatch[2], 10);
      const mins = gmtMatch[3];
      const meridiem = gmtMatch[4].toLowerCase();
      if (meridiem === "pm" && hours !== 12) hours += 12;
      if (meridiem === "am" && hours === 12) hours = 0;
      const iso = `${gmtMatch[1]}T${String(hours).padStart(2, "0")}:${mins}:00Z`;
      const d = new Date(iso);
      return Number.isNaN(d.getTime()) ? null : d;
    }

    // Format: "2025-11-09" (date-only, used by `added`) — UTC midnight
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
      const d = new Date(s + "T00:00:00Z");
      return Number.isNaN(d.getTime()) ? null : d;
    }

    // Fallback: try native parse (e.g. ISO strings with Z already present)
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? null : d;
  }, []);

  const getUpdatedMeta = useCallback(
    (dateString) => {
      const updatedDate = parseWpDate(dateString);
      if (!updatedDate) return { days: Infinity, color: "#ef4444", bg: "rgba(239,68,68,0.1)" };
      const now = new Date();
      const days = Math.max(0, Math.floor((now - updatedDate) / (1000 * 60 * 60 * 24)));
      if (days <= 14) return { days, color: "#059669", bg: "rgba(16,185,129,0.1)" };
      if (days <= 30) return { days, color: "#d97706", bg: "rgba(245,158,11,0.1)" };
      return { days, color: "#ef4444", bg: "rgba(239,68,68,0.1)" };
    },
    [parseWpDate]
  );

  const calculatePluginAge = useCallback((dateString) => {
    if (!dateString) return "Unknown age";
    const createdDate = parseWpDate(dateString);
    if (!createdDate) return "Unknown age";

    const nowMs = Date.now();
    const diffMs = nowMs - createdDate.getTime();
    if (diffMs < 0) return "Just created";

    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (totalDays < 1) return "New today";

    const years = Math.floor(totalDays / 365);
    const months = Math.floor((totalDays % 365) / 30);
    const days = totalDays % 30;

    const parts = [];
    if (years > 0) parts.push(`${years}y`);
    if (months > 0) parts.push(`${months}m`);
    if (days > 0) parts.push(`${days}d`);
    return parts.join(" ") || `${totalDays}d`;
  }, [parseWpDate]);

  const calculateLastUpdated = useCallback(
    (dateString) => {
      const updatedDate = parseWpDate(dateString);
      if (!updatedDate) return "Invalid date";

      const diffMs = Date.now() - updatedDate.getTime();
      if (diffMs < 0) return "Just now";

      const totalMinutes = Math.floor(diffMs / 60000);
      const totalHours = Math.floor(totalMinutes / 60);
      const totalDays = Math.floor(totalHours / 24);
      const totalMonths = Math.floor(totalDays / 30);
      const totalYears = Math.floor(totalMonths / 12);

      if (totalMinutes < 1) return "Just now";
      if (totalMinutes < 60) return `${totalMinutes}m ago`;
      if (totalHours < 24) {
        const mins = totalMinutes % 60;
        return mins > 0 ? `${totalHours}h ${mins}m ago` : `${totalHours}h ago`;
      }
      if (totalDays < 30) {
        const hrs = totalHours % 24;
        return hrs > 0 ? `${totalDays}d ${hrs}h ago` : `${totalDays}d ago`;
      }
      if (totalMonths < 12) {
        const days = totalDays % 30;
        return days > 0 ? `${totalMonths}mo ${days}d ago` : `${totalMonths}mo ago`;
      }
      const months = totalMonths % 12;
      return months > 0 ? `${totalYears}yr ${months}mo ago` : `${totalYears}yr ago`;
    },
    [parseWpDate]
  );

  const formatActiveInstalls = useCallback((activeInstalls) => {
    if (activeInstalls < 10) return "<10";
    if (activeInstalls < 1000) return `${activeInstalls}+`;
    if (activeInstalls < 1000000) return `${(activeInstalls / 1000).toFixed(0)}k+`;
    return `${(activeInstalls / 1000000).toFixed(1)}M+`;
  }, []);

  const fetchPlugins = useCallback(
    async (authorName, pluginSearchName, tagSearchName, page = 1) => {
      setLoading(true);
      setError(null);
      const safePage = Math.min(Math.max(page, 1), MAX_PAGE);
      const perPage = calculatePerPage(totalPlugins, MAX_PAGE);

      try {
        const params = [
          `page=${safePage}`,
          `per_page=${perPage}`,
          "fields[added]=1",
          "fields[active_installs]=1",
          "fields[rating]=1",
          "fields[short_description]=1",
          "fields[icons]=1",
          "fields[author_profile]=1",
        ];
        if (authorName) params.push(`author=${encodeURIComponent(authorName)}`);
        else if (pluginSearchName) params.push(`search=${encodeURIComponent(pluginSearchName)}`);
        else if (tagSearchName) params.push(`tag=${encodeURIComponent(tagSearchName)}`);
        else params.push("browse=new");

        const url = `${API_BASE_URL}?action=query_plugins&${params.join("&")}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch plugins");
        const data = await response.json();
        const resultCount = data?.info?.results ?? 0;
        setPlugins(data?.plugins || []);
        setTotalPlugins(resultCount);
        setTotalPages(Math.max(1, Math.min(MAX_PAGE, Math.ceil(resultCount / perPage))));
      } catch (fetchError) {
        setError("Failed to load plugins. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [calculatePerPage, totalPlugins]
  );

  useEffect(() => {
    fetchPlugins(author, pluginName, tagName, currentPage);
  }, [author, pluginName, tagName, currentPage, fetchPlugins]);

  const handleSearchSubmit = useCallback(
    (event) => {
      event.preventDefault();
      setAuthor("");
      setPluginName("");
      setTagName("");
      setCurrentPage(1);
      setError(null);

      const normalizedInput = searchInput.trim();
      if (!normalizedInput) return;
      if (searchType === "author") setAuthor(normalizedInput);
      else if (searchType === "plugin") setPluginName(normalizedInput);
      else setTagName(normalizedInput);
    },
    [searchInput, searchType]
  );

  const clearSearch = useCallback(() => {
    setAuthor("");
    setPluginName("");
    setTagName("");
    setSearchInput("");
    setCurrentPage(1);
    setSortOption("installation");
  }, []);

  const handleAuthorClick = useCallback((username) => {
    setSearchType("author");
    setSearchInput(username);
    setAuthor(username);
    setPluginName("");
    setTagName("");
    setCurrentPage(1);
  }, []);

  const handleTagClick = useCallback((tag) => {
    setSearchType("tag");
    setSearchInput(tag);
    setTagName(tag);
    setAuthor("");
    setPluginName("");
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback(
    (page) => {
      const nextPage = Math.min(Math.max(1, page), totalPages);
      if (nextPage !== currentPage) {
        setCurrentPage(nextPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [currentPage, totalPages]
  );

  const activeSearch = useMemo(() => {
    if (author) return { type: "Author", value: author };
    if (pluginName) return { type: "Plugin", value: pluginName };
    if (tagName) return { type: "Tag", value: tagName };
    return null;
  }, [author, pluginName, tagName]);

  const displayedPlugins = useMemo(() => {
    const sorted = [...plugins];
    sorted.sort((a, b) => {
      if (sortOption === "old") return new Date(a.added) - new Date(b.added);
      if (sortOption === "new") return new Date(b.added) - new Date(a.added);
      if (sortOption === "updated") {
        return (parseWpDate(b.last_updated)?.getTime() || 0) - (parseWpDate(a.last_updated)?.getTime() || 0);
      }
      if (sortOption === "star") return (b.rating || 0) - (a.rating || 0);
      return (b.active_installs || 0) - (a.active_installs || 0);
    });
    return sorted;
  }, [plugins, sortOption, parseWpDate]);

  const perPage = calculatePerPage(totalPlugins, MAX_PAGE);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 }, flex: 1 }}>
          {error && <ErrorState message={error} onRetry={() => setError(null)} />}

          <ResultToolbar
            totalPlugins={totalPlugins}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            searchType={searchType}
            setSearchType={setSearchType}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            handleSearchSubmit={handleSearchSubmit}
            activeSearch={activeSearch}
            clearSearch={clearSearch}
            sortOption={sortOption}
            setSortOption={setSortOption}
          />

        {loading ? (
          <LoadingState />
        ) : (
          <Box>
            {displayedPlugins.length > 0 ? (
              <>
                <PluginGrid
                  plugins={displayedPlugins}
                  currentPage={currentPage}
                  perPage={perPage}
                  formatActiveInstalls={formatActiveInstalls}
                  calculatePluginAge={calculatePluginAge}
                  calculateLastUpdated={calculateLastUpdated}
                  getUpdatedMeta={getUpdatedMeta}
                  onAuthorClick={handleAuthorClick}
                  onTagClick={handleTagClick}
                />
                {totalPages > 1 && (
                  <PaginationBar
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalPlugins={totalPlugins}
                    perPage={perPage}
                    jumpPage={jumpPage}
                    setJumpPage={setJumpPage}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            ) : (
              <EmptyState
                message={
                  activeSearch
                    ? `No results for ${activeSearch.type.toLowerCase()} "${activeSearch.value}". Adjust the query above.`
                    : "Use the bar above to search by author, plugin name, or tag."
                }
                onClear={clearSearch}
              />
            )}
          </Box>
        )}
        </Container>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            py: 4,
            px: 2,
            textAlign: "center",
            borderTop: "1px solid",
            borderColor: "rgba(15, 23, 42, 0.04)",
            bgcolor: "#ffffff",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              mb: 0.5,
            }}
          >
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: 2,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography sx={{ fontSize: "0.85rem", lineHeight: 1 }}>🔌</Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary", letterSpacing: "-0.01em" }}>
              WP Plugin Explorer
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
            Data from WordPress.org · Built with React & MUI · © {new Date().getFullYear()}
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default MainApp;
