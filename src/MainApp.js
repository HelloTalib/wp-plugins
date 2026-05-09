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
    const parsedDate = new Date(dateString.replace(/(am|pm)/i, " $1").replace("GMT", ""));
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
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
    const createdDate = new Date(dateString);
    if (Number.isNaN(createdDate.getTime())) return "Unknown age";

    const currentDate = new Date();
    const diffInHours = (currentDate - createdDate) / (1000 * 60 * 60);
    if (diffInHours < 24) return "New";
    const diffInDays = Math.floor(diffInHours / 24);
    const years = Math.floor(diffInDays / 365);
    const months = Math.floor((diffInDays % 365) / 30);
    const days = diffInDays % 30;
    const parts = [];
    if (years > 0) parts.push(`${years}y`);
    if (months > 0) parts.push(`${months}m`);
    if (days > 0 && years === 0) parts.push(`${days}d`); // Only show days if less than a year
    return parts.join(" ") || "Just created";
  }, []);

  const calculateLastUpdated = useCallback(
    (dateString) => {
      const updatedDate = parseWpDate(dateString);
      if (!updatedDate) return "Invalid date";
      const currentDate = new Date();
      const diffInMinutes = Math.floor((currentDate - updatedDate) / (1000 * 60));
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);
      const diffInMonths = Math.floor(diffInDays / 30);
      const diffInYears = Math.floor(diffInMonths / 12);
      const parts = [];
      if (diffInYears > 0) parts.push(`${diffInYears}yr`);
      if (diffInMonths % 12 > 0) parts.push(`${diffInMonths % 12}mo`);
      if (diffInDays % 30 > 0) parts.push(`${diffInDays % 30}d`);
      if (diffInHours % 24 > 0) parts.push(`${diffInHours % 24}h`);
      if (diffInMinutes % 60 > 0) parts.push(`${diffInMinutes % 60}m`);
      return parts.length > 0 ? `${parts.join(" ")} ago` : "Just now";
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
                onReset={clearSearch}
              />
            )}
          </Box>
        )}
        </Container>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            textAlign: "center",
            borderTop: "1px solid",
            borderColor: "rgba(148, 163, 184, 0.06)",
            bgcolor: "rgba(26, 26, 46, 0.6)",
            backdropFilter: "blur(12px)",
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
