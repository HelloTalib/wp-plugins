import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Button,
  TextField,
  Box,
  Chip,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  useMediaQuery,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CssBaseline,
  LinearProgress,
  ThemeProvider,
} from "@mui/material";


// Constants
const API_BASE_URL = 'https://api.wordpress.org/plugins/info/1.2/';
const MAX_PAGE = 999; // Maximum page number supported by the API
const MIN_PER_PAGE = 24; // Minimum number of items per page
const MAX_PER_PAGE = 100; // Maximum number of items per page for better performance

function App() {
  const theme = useTheme();

  const [plugins, setPlugins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [author, setAuthor] = useState("");
  const [pluginName, setPluginName] = useState("");
  const [tagName, setTagName] = useState("");
  const [totalPlugins, setTotalPlugins] = useState(0);
  const [error, setError] = useState(null);
  const [searchType, setSearchType] = useState("author");
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [apiInfo, setApiInfo] = useState({});
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [jumpPage, setJumpPage] = useState('');

  // Effect to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Calculate dynamic per_page value
  const calculatePerPage = useCallback((totalItems, targetMaxPages = MAX_PAGE, isBrowseNew = false) => {
    // If we don't have total items yet, use the minimum
    if (!totalItems) return MIN_PER_PAGE;

    // For browse=new queries, we want to ensure we can see all plugins within MAX_PAGE
    if (isBrowseNew) {
      // Calculate items per page needed to show all content within max page limit
      const idealPerPage = Math.ceil(totalItems / targetMaxPages);

      // Ensure we stay within reasonable limits (MIN_PER_PAGE to MAX_PER_PAGE)
      const optimalPerPage = Math.min(MAX_PER_PAGE, Math.max(MIN_PER_PAGE, idealPerPage));

      // Round to nearest 10 for cleaner pagination
      return Math.ceil(optimalPerPage / 10) * 10;
    } else {
      // For searches and filtered queries, use a more conservative approach
      // to prevent excessive data transfer for potentially less relevant results
      const minItemsPerPage = Math.ceil(totalItems / targetMaxPages);
      return Math.min(MAX_PER_PAGE, Math.ceil(Math.max(MIN_PER_PAGE, minItemsPerPage) / 10) * 10);
    }
  }, []);

  // Function to calculate the actual max pages based on total items and per_page
  const calculateMaxPages = useCallback((totalItems, perPage) => {
    if (!totalItems || !perPage) return MAX_PAGE;

    const actualPages = Math.ceil(totalItems / perPage);
    return Math.min(actualPages, MAX_PAGE);
  }, []);


  // Memoized API call functions
  const fetchPlugins = useCallback(async (authorName, pluginSearchName, tagSearchName, page = 1) => {
    setLoading(true);
    setError(null);

    // Ensure page doesn't exceed MAX_PAGE
    const safeRequestedPage = Math.min(page, MAX_PAGE);
    if (page !== safeRequestedPage) {
      console.warn(`Requested page ${page} exceeds maximum supported page ${MAX_PAGE}. Using page ${safeRequestedPage} instead.`);
      setCurrentPage(safeRequestedPage);
      page = safeRequestedPage;
    }

    try {
      // Determine if this is a browse=new query or a filtered query
      const isBrowseNew = !authorName && !pluginSearchName && !tagSearchName;

      // If we know the total plugins count, calculate optimal per_page
      const dynamicPerPage = calculatePerPage(totalPlugins, MAX_PAGE, isBrowseNew);
      console.log(`Using per_page=${dynamicPerPage} based on ${totalPlugins} total plugins (${isBrowseNew ? 'browse=new' : 'filtered'} query)`);

      let url = `${API_BASE_URL}?action=query_plugins`;

      const params = [];

      // Add page parameter for server-side pagination
      params.push(`page=${page}`);
      params.push(`per_page=${dynamicPerPage}`);

      if (authorName) {
        params.push(`author=${authorName}`);
      } else if (pluginSearchName) {
        params.push(`search=${pluginSearchName}`);
      } else if (tagSearchName) {
        params.push(`tag=${tagSearchName}`);
      } else {
        params.push(`browse=new`);
      }

      url = `${url}&${params.join('&')}`;
      console.log(`Fetching plugins from: ${url}`);


      console.log(`Fetching plugins: ${url}`);
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch plugins');

      const data = await response.json();

      // Log the API response for debugging
      console.log("API Response:", data);

      // Check if we got expected data for the requested page
      if (data.info && data.info.page !== page) {
        console.warn(`Requested page ${page} but received page ${data.info.page}`);
        // If the API defaulted to a different page, update our UI
        setCurrentPage(data.info.page);
      }

      // Save plugins data
      setPlugins(data.plugins || []);

      // Save API info (including page, pages, results)
      if (data.info) {
        setApiInfo(data.info);

        // Set total plugins from API response
        if (typeof data.info.results === 'number') {
          console.log("Total results:", data.info.results);
          setTotalPlugins(data.info.results);

          // Calculate optimal per_page and max pages based on this data
          const optimalPerPage = calculatePerPage(data.info.results, MAX_PAGE, isBrowseNew);
          const maxPossiblePages = calculateMaxPages(data.info.results, optimalPerPage);

          console.log(`Optimal per_page: ${optimalPerPage}, Max pages: ${maxPossiblePages}`);

          // If per_page value needs to change drastically, we may need to reload
          if (optimalPerPage > dynamicPerPage * 1.5 && page > 1) {
            // If we're not on page 1 and per_page would change significantly, suggest reload
            setError(`For better pagination, consider returning to page 1 to adjust items per page.`);
          }
        }

        // Set total pages based on optimal per_page, not the API's reported value
        if (typeof data.info.results === 'number') {
          const optimalPerPage = calculatePerPage(data.info.results, MAX_PAGE, isBrowseNew);
          const calculatedTotalPages = Math.min(Math.ceil(data.info.results / optimalPerPage), MAX_PAGE);
          console.log("Calculated total pages with optimal per_page:", calculatedTotalPages);
          setTotalPages(Math.max(1, calculatedTotalPages));
        } else if (typeof data.info.pages === 'number') {
          // Fallback to API pages but cap at MAX_PAGE
          console.log("Total pages from API:", data.info.pages);
          setTotalPages(Math.min(Math.max(1, data.info.pages), MAX_PAGE));
        } else {
          // Last resort fallback
          const calculatedTotalPages = Math.ceil(data.info.results / Math.max(1, dynamicPerPage));
          console.log("Calculated total pages (fallback):", calculatedTotalPages);
          setTotalPages(Math.min(Math.max(1, calculatedTotalPages), MAX_PAGE));
        }
      } else {
        console.warn("No 'info' property in API response:", data);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching plugins:", error);
      setError("Failed to load plugins. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [totalPlugins, calculatePerPage, calculateMaxPages]);

  const fetchTotalPlugins = useCallback(async () => {


    try {
      const response = await fetch(`${API_BASE_URL}?action=query_plugins&browse=new&per_page=1`);
      if (!response.ok) throw new Error('Failed to fetch total plugins');

      const data = await response.json();

      // Make sure we have a valid results count
      if (data.info && typeof data.info.results === 'number') {
      setTotalPlugins(data.info.results);

        // Calculate optimal per_page and maximum pages
        // Use isBrowseNew=true since this is always for browse=new
        const optimalPerPage = calculatePerPage(data.info.results, MAX_PAGE, true);
        const maxPossiblePages = calculateMaxPages(data.info.results, optimalPerPage);

        console.log(`Initial calculation - Total: ${data.info.results}, Optimal per_page: ${optimalPerPage}, Max pages: ${maxPossiblePages}`);

        // Set total pages based on our optimal per_page calculation, not API's reported value
        setTotalPages(maxPossiblePages);
      } else {
        console.warn("Invalid total plugins count in API response:", data);
      }
    } catch (error) {
      console.error("Error fetching total plugins:", error);
      setError("Failed to load total plugins count.");
    }
  }, [calculatePerPage, calculateMaxPages]);

  // Effect for initial data loading
  useEffect(() => {
    fetchTotalPlugins();
  }, [fetchTotalPlugins]);

  // Effect for pagination and search
  useEffect(() => {
    // Don't fetch if current page is invalid
    if (currentPage < 1 || (totalPages > 0 && currentPage > totalPages)) {
      console.warn(`Invalid page number: ${currentPage}, total pages: ${totalPages}`);
      // Reset to page 1 if current page is invalid
      setCurrentPage(1);
      return;
    }

    fetchPlugins(author, pluginName, tagName, currentPage);
  }, [author, pluginName, tagName, currentPage, totalPages, fetchPlugins]);

  // Handle response errors and reset pagination if needed
  useEffect(() => {
    if (error && currentPage > 1) {
      console.log("Error occurred, resetting to page 1");
      setCurrentPage(1);
    }
  }, [error, currentPage]);

  const handleSearchSubmit = useCallback((event) => {
    event.preventDefault();
    setAuthor("");
    setPluginName("");
    setTagName("");
    setCurrentPage(1);
    setError(null); // Clear any existing errors

    switch(searchType) {
      case "author":
        setAuthor(searchInput);
        break;
      case "plugin":
        setPluginName(searchInput);
        break;
      case "tag":
        setTagName(searchInput);
        break;
      default:
        setAuthor(searchInput);
    }

  }, [searchInput, searchType]);

  const clearSearch = useCallback(() => {
    setAuthor("");
    setPluginName("");
    setTagName("");
    setSearchInput("");
    setCurrentPage(1);
  }, []);

  const handleCopy = useCallback((text) => {
    setAuthor(text);
    setPluginName("");
    setTagName("");
    setSearchType("author");
    setSearchInput(text);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((event, value) => {
    // Validate the page number before setting it, ensuring it doesn't exceed MAX_PAGE
    const pageNum = Math.min(Math.max(1, value), Math.min(totalPages, MAX_PAGE));

    if (pageNum !== currentPage) {
      console.log(`Changing page from ${currentPage} to ${pageNum}`);
      setCurrentPage(pageNum);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage, totalPages]);

  // Memoized utility functions
  const formatActiveInstalls = useCallback((activeInstalls) => {
    if (activeInstalls < 10) return `<10`;
    if (activeInstalls < 1000) return `${activeInstalls}+`;
    if (activeInstalls < 1000000) return `${(activeInstalls / 1000).toFixed(0)}k+`;
    return `${(activeInstalls / 1000000).toFixed(1)}M+`;
  }, []);

  const calculatePluginAge = useCallback((dateString) => {
    const createdDate = new Date(dateString);
    const currentDate = new Date();
    const diffInHours = (currentDate - createdDate) / (1000 * 60 * 60);

    if (diffInHours < 24) return "newbie";

    const diffInDays = Math.floor(diffInHours / 24);
    const years = Math.floor(diffInDays / 365);
    const months = Math.floor((diffInDays % 365) / 30);
    const days = diffInDays % 30;

    const parts = [];
    if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`);
    if (months > 0) parts.push(`${months} month${months > 1 ? 's' : ''}`);
    if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);

    return parts.join(", ") || "Just created";
  }, []);

  const calculateLastUpdated = useCallback((dateString) => {
    const updatedDate = new Date(dateString.replace(/(am|pm)/i, " $1").replace("GMT", ""));
    updatedDate.setHours(updatedDate.getHours() + 6);
    const currentDate = new Date();

    if (isNaN(updatedDate)) return "Invalid date";

    const diffInMinutes = Math.floor((currentDate - updatedDate) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInMonths / 12);

    const parts = [];
    if (diffInYears > 0) parts.push(`${diffInYears}yr${diffInYears > 1 ? 's' : ''}`);
    if (diffInMonths % 12 > 0) parts.push(`${diffInMonths % 12}month${diffInMonths % 12 > 1 ? 's' : ''}`);
    if (diffInDays % 30 > 0) parts.push(`${diffInDays % 30}day${diffInDays % 30 > 1 ? 's' : ''}`);
    if (diffInHours % 24 > 0) parts.push(`${diffInHours % 24}hr${diffInHours % 24 > 1 ? 's' : ''}`);
    if (diffInMinutes % 60 > 0) parts.push(`${diffInMinutes % 60}min${diffInMinutes % 60 > 1 ? 's' : ''}`);

    const timeDifference = parts.length > 0 ? parts.join(" ") + " ago" : "Just now";
    const formattedTime = updatedDate.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: "Asia/Dhaka"
    });

    return `${timeDifference} at ${formattedTime.replace(" ", "")}`;
  }, []);

  // Memoized plugin card renderer
  const renderPluginCard = useCallback((plugin, index) => {
    const sortedPlugins = [...plugins].sort((a, b) => b.active_installs - a.active_installs);
    // Use the effective per_page value for calculating the local rank
    const effectivePerPage = calculatePerPage(totalPlugins, MAX_PAGE, !author && !pluginName && !tagName);
    const localRank = sortedPlugins.indexOf(plugin) + 1 + ((currentPage - 1) * effectivePerPage);
    const username = plugin.author_profile
      ? plugin.author_profile.split("/").filter(Boolean).pop()
      : "Unknown";

    // Calculate display rating out of 5
    const displayRating = plugin.rating ? (plugin.rating / 100 * 5) : 0;

    return (
      <Grid item key={plugin.slug} xs={12} sm={6} md={4}>
        <Card
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            transition: 'all 0.3s ease',
            overflow: 'visible',
            borderRadius: '12px',
            border: '1px solid rgba(0,0,0,0.05)',
            boxShadow: '0 6px 16px rgba(0,0,0,0.05)',
            '&:hover': {
              transform: 'translateY(-6px)',
              boxShadow: '0 16px 30px rgba(0,0,0,0.1)'
            }
          }}
        >
          {/* Rank badge with improved styling */}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://wp-rankings.com/plugins/${plugin.slug}/`}
            style={{ zIndex: 1 }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: -12,
                left: -12,
                width: 44,
                height: 44,
                bgcolor: 'white',
                color: '#333',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                zIndex: 1,
                fontSize: '0.9rem',
                border: '2px solid #f8f8f8',
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: '0 5px 15px rgba(0,0,0,0.12)',
                  transform: 'scale(1.05)'
                }
              }}
            >
              {localRank < 10 ? `0${localRank}` : localRank}
            </Box>
          </a>

          {/* Active installs badge with improved styling */}
          {plugin.active_installs >= 10 && (
            <a
              href={`https://plugintests.com/plugins/wporg/${plugin.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ zIndex: 1 }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: -12,
                  right: -12,
                  height: 32,
                  paddingX: 2,
                  bgcolor: plugin.active_installs < 1000
                    ? "rgba(255, 204, 203, 0.9)"
                    : plugin.active_installs < 10000
                    ? "rgba(255, 246, 143, 0.9)"
                    : "rgba(152, 251, 152, 0.9)",
                  color: '#333',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  zIndex: 1,
                  fontSize: '0.8rem',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(4px)',
                  '&:hover': {
                    boxShadow: '0 5px 15px rgba(0,0,0,0.12)',
                    transform: 'scale(1.05)'
                  }
                }}
              >
                {formatActiveInstalls(plugin.active_installs)} active
              </Box>
            </a>
          )}

          {/* Header section with favorite icon and plugin icon */}
          <Box
            sx={{
              p: 2.5,
              bgcolor: '#fafafa',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 160,
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px',
              borderBottom: '1px solid rgba(0,0,0,0.06)'
            }}
          >

            <Box sx={{
              height: 130,
              width: 130,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 2,
              borderRadius: '12px',
              backgroundColor: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 6px 16px rgba(0,0,0,0.08)'
              }
            }}>
              <CardMedia
                component="img"
                sx={{
                  objectFit: "contain",
                  height: 100,
                  width: 'auto',
                  margin: "0 auto",
                  transition: 'transform 0.3s ease',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                }}
                image={
                  plugin.icons
                    ? plugin.icons["2x"] ||
                      plugin.icons["1x"] ||
                      plugin.icons.default
                      : "https://s.w.org/plugins/geopattern-icon/classic-widgets.svg"
                }
                alt={plugin.name}
              />
            </Box>
          </Box>

          <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                mb: 1.5,
                fontWeight: 700,
                lineHeight: 1.3,
                fontSize: '1.1rem',
                height: '2.8rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                color: '#1a1a1a'
              }}
            >
              {plugin.name.replace(/&#8211;/g, "-").replace(/&amp;/g, "&")}
            </Typography>

            {/* Rating stars */}
            {displayRating > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <Box sx={{ display: 'flex', mr: 1 }}>
                  {[...Array(5)].map((_, i) => (
                    <Box
                      key={i}
                      component="span"
                      sx={{
                        color: i < Math.floor(displayRating) ? '#FFB400' : '#e0e0e0',
                        fontSize: '1rem',
                        mr: 0.3
                      }}
                    >
                      ★
                    </Box>
                  ))}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {displayRating.toFixed(1)}
                </Typography>
              </Box>
            )}

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2.5,
                height: '3rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                fontSize: '0.9rem',
                lineHeight: 1.5
              }}
            >
              {plugin.short_description}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 2.5,
                pb: 2,
                borderBottom: '1px solid rgba(0,0,0,0.06)'
              }}
            >
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: 'block',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    mb: 0.5
                  }}
                >
                  Age
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    color: '#444'
                  }}
                >
                  {calculatePluginAge(plugin.added)}
                </Typography>
              </Box>

              {!author && (
                <Box sx={{ textAlign: 'right' }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: 'block',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      mb: 0.5
                    }}
                  >
                    Author
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      color: '#0073aa',
                      '&:hover': {
                        color: '#005d8c',
                        textDecoration: 'underline'
                      }
                    }}
                    onClick={() => handleCopy(username)}
                  >
                    {username}
                  </Typography>
                </Box>
              )}

              {(author || pluginName || tagName) && (
                <Box sx={{ textAlign: 'right' }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: 'block',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      mb: 0.5
                    }}
                  >
                    Updated
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      color: '#444'
                    }}
                  >
                    {calculateLastUpdated(plugin.last_updated).split(' at')[0]}
                  </Typography>
                </Box>
              )}
            </Box>

            {plugin.tags && Object.keys(plugin.tags).length > 0 && (
              <Box sx={{ mb: 3, display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {Object.keys(plugin.tags).slice(0, 3).map(tag => (
                  <Chip
                    key={tag}
                    label={plugin.tags[tag]}
                    size="small"
                    onClick={() => {
                      setTagName(plugin.tags[tag]);
                      setAuthor("");
                      setPluginName("");
                      setSearchType("tag");
                      setSearchInput(plugin.tags[tag]);
                    }}
                    sx={{
                      cursor: "pointer",
                      bgcolor: 'rgba(0,115,170,0.08)',
                      color: '#0073aa',
                      fontSize: '0.75rem',
                      height: '24px',
                      fontWeight: 500,
                      '&:hover': {
                        bgcolor: 'rgba(0,115,170,0.15)',
                      }
                    }}
                  />
                ))}
              </Box>
            )}

            <Box sx={{ mt: 'auto' }}>
              <Button
                variant="contained"
                size="medium"
                href={`https://wordpress.org/plugins/${plugin.slug}`}
                target="_blank"
                fullWidth
                sx={{
                  textTransform: 'none',
                  borderRadius: '8px',
                  py: 1.2,
                  fontWeight: 600,
                  bgcolor: '#0073aa',
                  boxShadow: '0 4px 12px rgba(0,115,170,0.2)',
                  '&:hover': {
                    bgcolor: '#005d8c',
                    boxShadow: '0 6px 16px rgba(0,115,170,0.3)'
                  }
                }}
              >
                View Plugin
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    );
  }, [author, pluginName, tagName, calculatePluginAge, calculateLastUpdated, formatActiveInstalls, handleCopy, plugins, currentPage]);

  // Search component with improved UI
  const renderSearchSection = () => {
    const getPlaceholder = () => {
      switch(searchType) {
        case "author": return "e.g. automattic";
        case "plugin": return "e.g. woocommerce";
        case "tag": return "e.g. seo";
        default: return "Enter search term";
      }
    };

    const getLabel = () => {
      switch(searchType) {
        case "author": return "Author";
        case "plugin": return "Plugin Name";
        case "tag": return "Tag";
        default: return "Search";
      }
    };

    const getActiveSearch = () => {
      if (author) return { type: "Author", value: author };
      if (pluginName) return { type: "Plugin", value: pluginName };
      if (tagName) return { type: "Tag", value: tagName };
      return null;
    };

    const activeSearch = getActiveSearch();

    return (
      <Box
        sx={{
          background: 'linear-gradient(145deg, #ffffff 0%, #f0f7fa 100%)',
          borderRadius: '16px',
          p: { xs: 3, md: 4 },
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
          mb: 4,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,115,170,0.05) 0%, rgba(0,115,170,0) 70%)',
            top: '-120px',
            right: '-50px',
            zIndex: 0
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,115,170,0.05) 0%, rgba(0,115,170,0) 70%)',
            bottom: '-80px',
            left: '-80px',
            zIndex: 0
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: "#1a1a1a",
              mb: 1
            }}
          >
            Explore WordPress Plugins
          </Typography>

          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            sx={{
              mb: 4,
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Search by author, name or tag to find the perfect plugin for your needs
          </Typography>

          <Paper
            elevation={0}
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 2, md: 1.5 },
              alignItems: { xs: "stretch", md: "flex-end" },
              maxWidth: '900px',
              mx: 'auto',
              p: { xs: 2, md: 3 },
              borderRadius: '12px',
              border: '1px solid #eaecef',
              bgcolor: 'white'
            }}
          >
            <FormControl sx={{ minWidth: { xs: "100%", md: "180px" } }}>
              <InputLabel id="search-type-label">Search By</InputLabel>
              <Select
                labelId="search-type-label"
                value={searchType}
                label="Search By"
                onChange={(e) => setSearchType(e.target.value)}
                size="medium"
              >
                <MenuItem value="author">Author</MenuItem>
                <MenuItem value="plugin">Plugin Name</MenuItem>
                <MenuItem value="tag">Tag</MenuItem>
              </Select>
            </FormControl>

            <TextField
              variant="outlined"
              size="medium"
              fullWidth
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              label={getLabel()}
              placeholder={getPlaceholder()}
              InputProps={{
                endAdornment: searchInput ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setSearchInput("")}
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
              color="primary"
              disabled={!searchInput}
              startIcon={<span style={{ fontSize: '1.2rem' }}>🔍</span>}
              sx={{
                textTransform: 'none',
                borderRadius: "8px",
                py: 1.5,
                px: 3,
                minWidth: { xs: "100%", md: "160px" },
                bgcolor: '#0073aa',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: '#005d8c'
                }
              }}
            >
              Search
            </Button>
          </Paper>
          {activeSearch && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Box
                display="flex"
                alignItems="center"
                bgcolor="rgba(0, 115, 170, 0.1)"
                padding="8px 16px"
                borderRadius="20px"
              >
                <Typography variant="body2" color="#0073aa" fontWeight={500}>
                  {`${activeSearch.type}: ${activeSearch.value}`}
                </Typography>
                <IconButton
                  size="small"
                  onClick={clearSearch}
                  sx={{
                    ml: 0.5,
                    minWidth: 'auto',
                    p: 0.5,
                    color: '#0073aa'
                  }}
                >
                  ✕
                </IconButton>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  // Improved loading indicator component
  const renderLoadingIndicator = () => (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 3,
        py: 8,
        px: 4,
        borderRadius: '16px',
        backgroundColor: 'white',
        border: '1px solid #eaecef',
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)'
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CircularProgress
          size={60}
          thickness={4}
          sx={{
            color: '#0073aa',
            animation: 'pulse 1.5s infinite ease-in-out',
            '@keyframes pulse': {
              '0%': {
                boxShadow: '0 0 0 0 rgba(0, 115, 170, 0.4)',
              },
              '70%': {
                boxShadow: '0 0 0 15px rgba(0, 115, 170, 0)',
              },
              '100%': {
                boxShadow: '0 0 0 0 rgba(0, 115, 170, 0)',
              },
            },
          }}
        />
        <Box
          component="img"
          src="https://s.w.org/style/images/about/WordPress-logotype-standard.png"
          alt="WordPress Logo"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '26px',
            height: 'auto',
            opacity: 0.9,
          }}
        />
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          variant="h6"
          color="text.primary"
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          Discovering WordPress Plugins
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ maxWidth: '300px', mx: 'auto', mb: 2 }}
        >
          Fetching plugins from the official WordPress repository. This may take a moment...
        </Typography>
        <LinearProgress
          sx={{
            height: 6,
            borderRadius: 3,
            maxWidth: '300px',
            mx: 'auto',
            bgcolor: 'rgba(0,115,170,0.1)',
            '.MuiLinearProgress-bar': {
              bgcolor: '#0073aa',
            }
          }}
        />
      </Box>
    </Paper>
  );

  // Improved error display component
  const renderError = () => (
    <Paper
      elevation={0}
      sx={{
        mb: 4,
        p: 4,
        backgroundColor: "rgba(244, 67, 54, 0.03)",
        borderRadius: "16px",
        border: '1px solid rgba(244, 67, 54, 0.2)',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'center', sm: 'flex-start' },
        gap: 3,
        maxWidth: '800px',
        mx: 'auto',
        textAlign: { xs: 'center', sm: 'left' }
      }}
    >
      <Box
        sx={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'rgba(244, 67, 54, 0.1)',
          color: '#f44336',
          fontSize: '2rem',
          fontWeight: 'bold',
          flexShrink: 0
        }}
      >
        !
      </Box>
      <Box>
        <Typography
          variant="h5"
          color="error.main"
          fontWeight={700}
          gutterBottom
          sx={{ mb: 1 }}
        >
          Oops! Something went wrong
        </Typography>
        <Typography
          color="error.main"
          variant="body1"
          sx={{
            mb: 2,
            opacity: 0.9,
            fontWeight: 500
          }}
        >
          {error}
        </Typography>
        <Button
          variant="outlined"
          color="error"
          onClick={() => setError(null)}
          sx={{
            textTransform: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            py: 1
          }}
        >
          Try Again
        </Button>
      </Box>
    </Paper>
  );

  // Improved empty results component
  const renderEmptyResults = () => (
    <Paper
      elevation={0}
      sx={{
        py: 6,
        px: 4,
        textAlign: "center",
        backgroundColor: "#f9fafb",
        borderRadius: "16px",
        maxWidth: '600px',
        mx: 'auto',
        border: '1px solid #eaecef',
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)'
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'rgba(0, 0, 0, 0.05)',
          color: 'text.secondary',
          fontSize: '2.5rem',
          mx: 'auto',
          mb: 3
        }}
      >
        🔍
      </Box>
      <Typography
        variant="h5"
        color="text.primary"
        gutterBottom
        sx={{ fontWeight: 700, mb: 1 }}
      >
        No plugins found
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        paragraph
        sx={{ mb: 3, maxWidth: '400px', mx: 'auto' }}
      >
        {author ? `We couldn't find any plugins for the author "${author}".` :
         pluginName ? `No plugins found matching "${pluginName}".` :
         tagName ? `No plugins found with tag "${tagName}".` :
         `No plugins found. Try a different search.`}
      </Typography>
      {(author || pluginName || tagName) && (
        <Button
          variant="contained"
          color="primary"
          onClick={clearSearch}
          startIcon={<span>↩</span>}
          sx={{
            mt: 2,
            textTransform: 'none',
            bgcolor: '#0073aa',
            fontWeight: 600,
            borderRadius: '8px',
            py: 1.2,
            px: 3,
            boxShadow: '0 4px 12px rgba(0,115,170,0.2)',
            '&:hover': {
              bgcolor: '#005d8c',
              boxShadow: '0 6px 16px rgba(0,115,170,0.3)'
            }
          }}
        >
          Show new plugins instead
        </Button>
      )}
    </Paper>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ pb: 8 }}>
        {error && renderError()}
        {renderSearchSection()}

        {loading ? (
          renderLoadingIndicator()
        ) : (
          <>
            {plugins.length > 0 && (
              <>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={3}
                  flexDirection={{ xs: "column", sm: "row" }}
                  gap={2}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "rgba(0, 115, 170, 0.1)",
                        color: "#0073aa",
                      }}
                    >
                      <span aria-hidden="true">#</span>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {`${totalPlugins.toLocaleString()} ${
                        totalPlugins === 1 ? "Plugin" : "Plugins"
                      } Found`}
                    </Typography>
                  </Box>

                  {/* Top pagination buttons */}
                  {totalPages > 1 && plugins.length > 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        bgcolor: "rgba(0, 115, 170, 0.05)",
                        borderRadius: "8px",
                        p: 0.5,
                        pl: 2,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: "text.secondary",
                          display: { xs: "none", sm: "block" },
                        }}
                      >
                        Page {currentPage} of {Math.min(totalPages, MAX_PAGE)}
                      </Typography>

                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <Button
                          disabled={currentPage === 1}
                          onClick={() =>
                            handlePageChange(null, currentPage - 1)
                          }
                          variant="outlined"
                          size="small"
                          aria-label="Previous page"
                          sx={{
                            minWidth: 36,
                            height: 36,
                            p: 0,
                            border: "1px solid #e0e0e0",
                            "&:hover": {
                              border: "1px solid #0073aa",
                              bgcolor: "rgba(0, 115, 170, 0.1)",
                            },
                            "&.Mui-disabled": {
                              opacity: 0.4,
                            },
                          }}
                        >
                          <span aria-hidden="true">‹</span>
                        </Button>
                        <Button
                          disabled={
                            currentPage === Math.min(totalPages, MAX_PAGE)
                          }
                          onClick={() =>
                            handlePageChange(null, currentPage + 1)
                          }
                          variant="outlined"
                          size="small"
                          aria-label="Next page"
                          sx={{
                            minWidth: 36,
                            height: 36,
                            p: 0,
                            border: "1px solid #e0e0e0",
                            "&:hover": {
                              border: "1px solid #0073aa",
                              bgcolor: "rgba(0, 115, 170, 0.1)",
                            },
                            "&.Mui-disabled": {
                              opacity: 0.4,
                            },
                          }}
                        >
                          <span aria-hidden="true">›</span>
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Box>
                <Grid container spacing={3}>
                  {plugins
                    .sort((a, b) => b.active_installs - a.active_installs)
                    .map((plugin, index) => renderPluginCard(plugin, index))}
                </Grid>

                {/* Pagination */}
                <Paper
                  elevation={0}
                  sx={{
                    mt: 5,
                    mb: 3,
                    py: 2.5,
                    px: 3,
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                    borderRadius: "12px",
                    backgroundColor: "#f9fafb",
                    border: "1px solid #eaecef",
                  }}
                >
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {/* Calculate values for pagination display */}
                    {(() => {
                      // Determine if this is a browse=new query or a filtered query
                      const isBrowseNew = !author && !pluginName && !tagName;
                      // Get the actual per_page value being used
                      const effectivePerPage = calculatePerPage(
                        totalPlugins,
                        MAX_PAGE,
                        isBrowseNew
                      );
                      // Calculate the start and end items on the current page
                      const startItem =
                        (currentPage - 1) * effectivePerPage + 1;
                      // Make sure endItem doesn't exceed total plugin count
                      const endItem = Math.min(
                        currentPage * effectivePerPage,
                        totalPlugins
                      );

                      return (
                        <>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontWeight: 500 }}
                          >
                            Showing <strong>{startItem}</strong> -{" "}
                            <strong>{endItem}</strong> of{" "}
                            <strong>{totalPlugins.toLocaleString()}</strong>{" "}
                            plugins
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Page <strong>{currentPage}</strong> of{" "}
                            <strong>
                              {Math.min(totalPages, MAX_PAGE).toLocaleString()}
                            </strong>{" "}
                            {totalPages > MAX_PAGE
                              ? `(limited to ${MAX_PAGE})`
                              : ""}
                          </Typography>
                          {effectivePerPage !== MIN_PER_PAGE && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Displaying {effectivePerPage} plugins per page{" "}
                              {isBrowseNew
                                ? "to view all content"
                                : "to optimize navigation"}
                            </Typography>
                          )}
                        </>
                      );
                    })()}
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Button
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(null, 1)}
                      variant="outlined"
                      size="small"
                      sx={{
                        minWidth: { xs: 32, sm: 40 },
                        height: { xs: 32, sm: 40 },
                        p: 0,
                        border: "1px solid #e0e0e0",
                        "&:hover": {
                          border: "1px solid #0073aa",
                          bgcolor: "rgba(0, 115, 170, 0.04)",
                        },
                        display: { xs: "none", sm: "flex" },
                      }}
                    >
                      <span aria-hidden="true">«</span>
                    </Button>

                    <Button
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(null, currentPage - 1)}
                      variant="outlined"
                      size="small"
                      sx={{
                        minWidth: { xs: 32, sm: 40 },
                        height: { xs: 32, sm: 40 },
                        p: 0,
                        border: "1px solid #e0e0e0",
                        "&:hover": {
                          border: "1px solid #0073aa",
                          bgcolor: "rgba(0, 115, 170, 0.04)",
                        },
                      }}
                    >
                      <span aria-hidden="true">‹</span>
                    </Button>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      {/* Display page numbers - limit display to keep UI manageable */}
                      {Math.min(totalPages, MAX_PAGE) <= 10 ? (
                        // If 10 or fewer pages, show all
                        [...Array(Math.min(totalPages, MAX_PAGE))].map(
                          (_, index) => {
                            const pageNumber = index + 1;
                            return (
                              <Button
                                key={pageNumber}
                                variant={
                                  pageNumber === currentPage
                                    ? "contained"
                                    : "outlined"
                                }
                                onClick={() =>
                                  handlePageChange(null, pageNumber)
                                }
                                color={
                                  pageNumber === currentPage
                                    ? "primary"
                                    : "inherit"
                                }
                                size="small"
                                sx={{
                                  minWidth: { xs: 32, sm: 40 },
                                  height: { xs: 32, sm: 40 },
                                  p: 0,
                                  bgcolor:
                                    pageNumber === currentPage
                                      ? "#0073aa"
                                      : "transparent",
                                  border:
                                    pageNumber === currentPage
                                      ? "none"
                                      : "1px solid #e0e0e0",
                                  "&:hover": {
                                    bgcolor:
                                      pageNumber === currentPage
                                        ? "#005d8c"
                                        : "rgba(0, 115, 170, 0.04)",
                                    border:
                                      pageNumber === currentPage
                                        ? "none"
                                        : "1px solid #0073aa",
                                  },
                                }}
                              >
                                {pageNumber}
                              </Button>
                            );
                          }
                        )
                      ) : (
                        // For extremely large page counts, show reduced navigation
                        <>
                          {/* First page */}
                          <Button
                            key={1}
                            variant={
                              1 === currentPage ? "contained" : "outlined"
                            }
                            onClick={() => handlePageChange(null, 1)}
                            color={1 === currentPage ? "primary" : "inherit"}
                            size="small"
                            sx={{
                              minWidth: { xs: 32, sm: 40 },
                              height: { xs: 32, sm: 40 },
                              p: 0,
                              bgcolor:
                                1 === currentPage ? "#0073aa" : "transparent",
                              border:
                                1 === currentPage
                                  ? "none"
                                  : "1px solid #e0e0e0",
                              "&:hover": {
                                bgcolor:
                                  1 === currentPage
                                    ? "#005d8c"
                                    : "rgba(0, 115, 170, 0.04)",
                                border:
                                  1 === currentPage
                                    ? "none"
                                    : "1px solid #0073aa",
                              },
                            }}
                          >
                            1
                          </Button>

                          {/* Left ellipsis if needed */}
                          {currentPage > 3 && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                minWidth: { xs: 32, sm: 40 },
                                height: { xs: 32, sm: 40 },
                              }}
                            >
                              …
                            </Box>
                          )}

                          {/* Pages around current page */}
                          {[...Array(5)].map((_, index) => {
                            // Show 2 pages before and 2 pages after current
                            const offset = index - 2;
                            const pageNumber = currentPage + offset;
                            const maxDisplayPage = Math.min(
                              totalPages,
                              MAX_PAGE
                            );

                            // Only show if page is valid and not already shown (first or last)
                            if (
                              pageNumber > 1 &&
                              pageNumber < maxDisplayPage &&
                              pageNumber > 0
                            ) {
                              return (
                                <Button
                                  key={pageNumber}
                                  variant={
                                    pageNumber === currentPage
                                      ? "contained"
                                      : "outlined"
                                  }
                                  onClick={() =>
                                    handlePageChange(null, pageNumber)
                                  }
                                  color={
                                    pageNumber === currentPage
                                      ? "primary"
                                      : "inherit"
                                  }
                                  size="small"
                                  sx={{
                                    minWidth: { xs: 32, sm: 40 },
                                    height: { xs: 32, sm: 40 },
                                    p: 0,
                                    bgcolor:
                                      pageNumber === currentPage
                                        ? "#0073aa"
                                        : "transparent",
                                    border:
                                      pageNumber === currentPage
                                        ? "none"
                                        : "1px solid #e0e0e0",
                                    "&:hover": {
                                      bgcolor:
                                        pageNumber === currentPage
                                          ? "#005d8c"
                                          : "rgba(0, 115, 170, 0.04)",
                                      border:
                                        pageNumber === currentPage
                                          ? "none"
                                          : "1px solid #0073aa",
                                    },
                                  }}
                                >
                                  {pageNumber}
                                </Button>
                              );
                            }
                            return null;
                          })}

                          {/* Right ellipsis if needed */}
                          {currentPage < Math.min(totalPages, MAX_PAGE) - 2 && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                minWidth: { xs: 32, sm: 40 },
                                height: { xs: 32, sm: 40 },
                              }}
                            >
                              …
                            </Box>
                          )}

                          {/* Last page */}
                          {Math.min(totalPages, MAX_PAGE) > 1 && (
                            <Button
                              key={Math.min(totalPages, MAX_PAGE)}
                              variant={
                                Math.min(totalPages, MAX_PAGE) === currentPage
                                  ? "contained"
                                  : "outlined"
                              }
                              onClick={() =>
                                handlePageChange(
                                  null,
                                  Math.min(totalPages, MAX_PAGE)
                                )
                              }
                              color={
                                Math.min(totalPages, MAX_PAGE) === currentPage
                                  ? "primary"
                                  : "inherit"
                              }
                              size="small"
                              sx={{
                                minWidth: { xs: 32, sm: 40 },
                                height: { xs: 32, sm: 40 },
                                p: 0,
                                bgcolor:
                                  Math.min(totalPages, MAX_PAGE) === currentPage
                                    ? "#0073aa"
                                    : "transparent",
                                border:
                                  Math.min(totalPages, MAX_PAGE) === currentPage
                                    ? "none"
                                    : "1px solid #e0e0e0",
                                "&:hover": {
                                  bgcolor:
                                    Math.min(totalPages, MAX_PAGE) ===
                                    currentPage
                                      ? "#005d8c"
                                      : "rgba(0, 115, 170, 0.04)",
                                  border:
                                    Math.min(totalPages, MAX_PAGE) ===
                                    currentPage
                                      ? "none"
                                      : "1px solid #0073aa",
                                },
                              }}
                            >
                              {Math.min(totalPages, MAX_PAGE)}
                            </Button>
                          )}
                        </>
                      )}
                    </Box>

                    <Button
                      disabled={currentPage === Math.min(totalPages, MAX_PAGE)}
                      onClick={() => handlePageChange(null, currentPage + 1)}
                      variant="outlined"
                      size="small"
                      sx={{
                        minWidth: { xs: 32, sm: 40 },
                        height: { xs: 32, sm: 40 },
                        p: 0,
                        border: "1px solid #e0e0e0",
                        "&:hover": {
                          border: "1px solid #0073aa",
                          bgcolor: "rgba(0, 115, 170, 0.04)",
                        },
                      }}
                    >
                      <span aria-hidden="true">›</span>
                    </Button>

                    <Button
                      disabled={currentPage === Math.min(totalPages, MAX_PAGE)}
                      onClick={() =>
                        handlePageChange(null, Math.min(totalPages, MAX_PAGE))
                      }
                      variant="outlined"
                      size="small"
                      sx={{
                        minWidth: { xs: 32, sm: 40 },
                        height: { xs: 32, sm: 40 },
                        p: 0,
                        border: "1px solid #e0e0e0",
                        "&:hover": {
                          border: "1px solid #0073aa",
                          bgcolor: "rgba(0, 115, 170, 0.04)",
                        },
                        display: { xs: "none", sm: "flex" },
                      }}
                    >
                      <span aria-hidden="true">»</span>
                    </Button>
                  </Box>
                </Paper>

                {/* Jump to page component */}
                {totalPages > 1 && plugins.length > 0 && (
                  <Paper
                    component="form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const pageNum = parseInt(jumpPage, 10);
                      const maxValidPage = Math.min(totalPages, MAX_PAGE);
                      if (
                        !isNaN(pageNum) &&
                        pageNum >= 1 &&
                        pageNum <= maxValidPage
                      ) {
                        handlePageChange(null, pageNum);
                        setJumpPage("");
                      }
                    }}
                    sx={{
                      mt: 2,
                      p: 2,
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      alignItems: "center",
                      gap: 2,
                      borderRadius: "12px",
                      bgcolor: "#f9fafb",
                      border: "1px solid #eaecef",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        width: { xs: "100%", sm: "auto" },
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Jump to page:
                      </Typography>
                      <TextField
                        size="small"
                        value={jumpPage}
                        onChange={(e) => setJumpPage(e.target.value)}
                        placeholder={`1-${Math.min(totalPages, MAX_PAGE)}`}
                        sx={{ width: "100px" }}
                        inputProps={{
                          type: "number",
                          min: 1,
                          max: Math.min(totalPages, MAX_PAGE),
                        }}
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        size="small"
                        disabled={!jumpPage}
                        sx={{
                          textTransform: "none",
                          bgcolor: "#0073aa",
                          "&:hover": {
                            bgcolor: "#005d8c",
                          },
                        }}
                      >
                        Go
                      </Button>
                    </Box>

                    {totalPages > MAX_PAGE && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: { xs: 1, sm: 0 } }}
                      >
                        Note: Displaying up to {MAX_PAGE} pages. Showing
                        approximately {calculatePerPage(totalPlugins)} plugins
                        per page.
                      </Typography>
                    )}
                  </Paper>
                )}
              </>
            )}
            {!loading && plugins.length === 0 && renderEmptyResults()}
          </>
        )}

        {/* Plugin count and info box */}
        <Box
          sx={{
            position: "fixed",
            bottom: "20px",
            right: "90px",
            padding: "10px 16px",
            backgroundColor: "rgba(0, 115, 170, 0.95)",
            color: "white",
            borderRadius: "20px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            backdropFilter: "blur(4px)",
            zIndex: 10,
            display: { xs: "none", md: "block" },
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {`${
              totalPlugins > 0 ? totalPlugins.toLocaleString() : "Loading..."
            } Plugins (${Math.min(
              totalPages,
              MAX_PAGE
            ).toLocaleString()} pages)`}
            {totalPlugins > 0 && (
              <span
                style={{ fontSize: "0.8rem", display: "block", opacity: 0.9 }}
              >
                {`${calculatePerPage(
                  totalPlugins,
                  MAX_PAGE,
                  !author && !pluginName && !tagName
                )} plugins per page`}
              </span>
            )}
          </Typography>
        </Box>

        {/* Scroll to top button with improved styling */}
        {showScrollTop && (
          <Box
            onClick={scrollToTop}
            sx={{
              position: "fixed",
              bottom: "80px",
              right: "20px",
              width: 48,
              height: 48,
              backgroundColor: "white",
              color: "#0073aa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              zIndex: 10,
              border: "1px solid rgba(0, 115, 170, 0.2)",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "rgba(0, 115, 170, 0.05)",
                transform: "translateY(-3px)",
                boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
              },
            }}
          >
            <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>↑</span>
          </Box>
        )}
      </Container>

      {/* Modern footer */}
      <Box
        sx={{
          mt: 4,
          pt: 3,
          pb: 3,
          borderTop: "1px solid #eaecef",
          textAlign: "center",
          color: "text.secondary",
          fontSize: "0.875rem",
        }}
      >
        © {new Date().getFullYear()} WP Plugin Explorer. Built with React and
        Material-UI.
      </Box>
    </ThemeProvider>
  );
}

export default App;
