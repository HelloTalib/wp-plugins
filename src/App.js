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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Rating,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  Slider,
  Divider,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#21759b', // WordPress blue
      light: '#72aee6',
      dark: '#135e96',
      contrastText: '#fff',
    },
    secondary: {
      main: '#d63638', // WordPress red
      light: '#e65054',
      dark: '#8c2626',
      contrastText: '#fff',
    },
    background: {
      default: '#f6f7f7',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '6px',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
});

// Constants
const API_BASE_URL = 'https://api.wordpress.org/plugins/info/1.2/';
const DEFAULT_PER_PAGE = 50;
const AUTHOR_PER_PAGE = 50;

function App() {
  const [plugins, setPlugins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [author, setAuthor] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [inputSearch, setInputSearch] = useState("");
  const [searchType, setSearchType] = useState("author");
  const [totalPlugins, setTotalPlugins] = useState(0);
  const [error, setError] = useState(null);

  // New state variables for added features
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("active_installs");
  const [sortOrder, setSortOrder] = useState("desc");
  const [minRating, setMinRating] = useState(0);
  const [wpVersionFilter, setWpVersionFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [installsRange, setInstallsRange] = useState([0, 5000000]);
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('wpPluginFavorites')) || []);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Add new state variables for new features
  const [compareList, setCompareList] = useState([]);
  const [showCompareDrawer, setShowCompareDrawer] = useState(false);
  const [selectedPlugin, setSelectedPlugin] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState(
    JSON.parse(localStorage.getItem('wpPluginRecentlyViewed')) || []
  );
  const [showRecentlyViewed, setShowRecentlyViewed] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [pluginTags, setPluginTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  // Analytics state variables
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analyticsType, setAnalyticsType] = useState("rating");
  const [analyticsData, setAnalyticsData] = useState([]);
  const [topPlugins, setTopPlugins] = useState({});
  const [pluginsByCategory, setPluginsByCategory] = useState({});
  const [versionDistribution, setVersionDistribution] = useState({});
  const [updateFrequency, setUpdateFrequency] = useState({});
  const [searchHistory, setSearchHistory] = useState(
    JSON.parse(localStorage.getItem('wpPluginSearchHistory')) || []
  );
  const [selectedTagForAnalytics, setSelectedTagForAnalytics] = useState("");
  const [tagCompetitorData, setTagCompetitorData] = useState([]);
  const [growthAnalyticsData, setGrowthAnalyticsData] = useState({});
  const [showGrowthAnalytics, setShowGrowthAnalytics] = useState(false);
  const [growthHistoryData, setGrowthHistoryData] = useState(
    JSON.parse(localStorage.getItem('wpPluginGrowthHistory')) || {}
  );
  const [selectedPluginsForGrowth, setSelectedPluginsForGrowth] = useState([]);
  const [growthTimeframe, setGrowthTimeframe] = useState("6months");
  const [showGrowthTrendChart, setShowGrowthTrendChart] = useState(false);
  const [selectedPluginForTrend, setSelectedPluginForTrend] = useState(null);

  // Simple function (not useCallback) to get page title to avoid dependency issues
  function getPageTitleForCSV() {
    if (showFavoritesOnly) return "favorites";
    if (!searchTerm) return "new";
    if (searchType === "author") return `author-${searchTerm}`;
    if (searchType === "name") return `name-${searchTerm}`;
    if (searchType === "tag") return `tag-${searchTerm}`;
    return searchTerm;
  }

  // Function declarations - moved up to fix initialization order
  const handleAddToCompare = useCallback((plugin) => {
    if (compareList.find(p => p.slug === plugin.slug)) {
      setSnackbarMessage("Plugin already in comparison list");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    if (compareList.length >= 3) {
      setSnackbarMessage("You can compare maximum 3 plugins at a time");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    setCompareList(prev => [...prev, plugin]);
    setSnackbarMessage(`${plugin.name} added to comparison`);
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  }, [compareList]);

  const handleRemoveFromCompare = useCallback((slug) => {
    setCompareList(prev => prev.filter(p => p.slug !== slug));
  }, []);

  const handleViewPluginDetails = useCallback((plugin) => {
    setSelectedPlugin(plugin);
    setOpenModal(true);

    // Add to recently viewed if not already at the top
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.slug !== plugin.slug);
      return [plugin, ...filtered].slice(0, 10);
    });
  }, []);

  const handleClearCompare = useCallback(() => {
    setCompareList([]);
    setShowCompareDrawer(false);
  }, []);

  // Function to toggle tag selection
  const handleTagToggle = useCallback((tag) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  }, []);

  // Function to handle installs range changes
  const handleInstallsRangeChange = useCallback((event, newValue) => {
    setInstallsRange(newValue);
  }, []);

  // Function to format installs value for display
  const formatInstallValueText = useCallback((value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M+`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k+`;
    }
    return `${value}+`;
  }, []);

  // Memoized API call functions
  const fetchPlugins = useCallback(async (search, type, pageNum) => {
    setLoading(true);
    setError(null);
    try {
      let url;

      if (!search && !showFavoritesOnly) {
        url = `${API_BASE_URL}?action=query_plugins&browse=new&per_page=${DEFAULT_PER_PAGE}&page=${pageNum}`;
      } else if (type === "author") {
        url = `${API_BASE_URL}?action=query_plugins&author=${search}&per_page=${AUTHOR_PER_PAGE}&page=${pageNum}`;
      } else if (type === "name") {
        url = `${API_BASE_URL}?action=query_plugins&search=${search}&per_page=${DEFAULT_PER_PAGE}&page=${pageNum}`;
      } else if (type === "tag") {
        url = `${API_BASE_URL}?action=query_plugins&tag=${search}&per_page=${DEFAULT_PER_PAGE}&page=${pageNum}`;
      }

      // If showing favorites only, don't make API call - we'll filter locally
      if (showFavoritesOnly && favorites.length === 0) {
        setPlugins([]);
        setLoading(false);
        setTotalPlugins(0);
        return;
      }

      if (showFavoritesOnly) {
        // Fetch individual plugin details for each favorite
        const favoritePlugins = [];
        for (const slug of favorites) {
          try {
            const pluginResponse = await fetch(`${API_BASE_URL}?action=plugin_information&slug=${slug}`);
            if (pluginResponse.ok) {
              const pluginData = await pluginResponse.json();
              favoritePlugins.push(pluginData);
            }
          } catch (e) {
            console.error(`Failed to fetch favorite plugin: ${slug}`, e);
          }
        }
        setPlugins(favoritePlugins);
        setTotalPlugins(favoritePlugins.length);
        setLoading(false);
        return;
      }

      console.log(`Fetching plugins: ${url}`);
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch plugins');

      const data = await response.json();
      setPlugins(data.plugins || []);

      if (data.info && data.info.results) {
        setTotalPlugins(data.info.results);
      }
    } catch (error) {
      console.error("Error fetching plugins:", error);
      setError("Failed to load plugins. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [favorites, showFavoritesOnly]);

  const fetchTotalPlugins = useCallback(async () => {
    if (showFavoritesOnly) {
      setTotalPlugins(favorites.length);
      return;
    }

    try {
      // Use the same search parameters for getting total count
      let url;
      if (!searchTerm) {
        url = `${API_BASE_URL}?action=query_plugins&browse=new&per_page=1`;
      } else if (searchType === "author") {
        url = `${API_BASE_URL}?action=query_plugins&author=${searchTerm}&per_page=1`;
      } else if (searchType === "name") {
        url = `${API_BASE_URL}?action=query_plugins&search=${searchTerm}&per_page=1`;
      } else if (searchType === "tag") {
        url = `${API_BASE_URL}?action=query_plugins&tag=${searchTerm}&per_page=1`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch total plugins');

      const data = await response.json();
      setTotalPlugins(data.info.results);
    } catch (error) {
      console.error("Error fetching total plugins:", error);
      setError("Failed to load total plugins count.");
    }
  }, [showFavoritesOnly, favorites.length, searchTerm, searchType]);

  // Effect for initial data loading
  useEffect(() => {
    fetchTotalPlugins();
    fetchPlugins(searchTerm, searchType, page);
  }, [searchTerm, searchType, page, fetchPlugins, fetchTotalPlugins, showFavoritesOnly]);

  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem('wpPluginFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Effect to save recently viewed plugins to localStorage
  useEffect(() => {
    localStorage.setItem('wpPluginRecentlyViewed', JSON.stringify(recentlyViewed.slice(0, 10)));
  }, [recentlyViewed]);

  // Save search history to localStorage
  useEffect(() => {
    localStorage.setItem('wpPluginSearchHistory', JSON.stringify(searchHistory.slice(0, 20)));
  }, [searchHistory]);

  // Generate analytics data when plugins change
  useEffect(() => {
    if (plugins.length > 0) {
      // Calculate top plugins by different metrics
      const top10ByInstalls = [...plugins]
        .sort((a, b) => b.active_installs - a.active_installs)
        .slice(0, 10);

      const top10ByRating = [...plugins]
        .filter(p => p.rating > 0)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 10);

      const top10ByAge = [...plugins]
        .sort((a, b) => new Date(a.added) - new Date(b.added))
        .slice(0, 10);

      const top10ByRecent = [...plugins]
        .sort((a, b) => new Date(b.last_updated) - new Date(a.last_updated))
        .slice(0, 10);

      setTopPlugins({
        installs: top10ByInstalls,
        rating: top10ByRating,
        age: top10ByAge,
        recent: top10ByRecent
      });

      // Categorize plugins by tag
      const tagCategories = {};
      plugins.forEach(plugin => {
        if (plugin.tags) {
          Object.keys(plugin.tags).forEach(tag => {
            if (!tagCategories[tag]) tagCategories[tag] = [];
            tagCategories[tag].push(plugin);
          });
        }
      });
      setPluginsByCategory(tagCategories);

      // WordPress version compatibility distribution
      const versionDist = {};
      plugins.forEach(plugin => {
        if (plugin.tested) {
          const majorVersion = plugin.tested.split('.').slice(0, 2).join('.');
          versionDist[majorVersion] = (versionDist[majorVersion] || 0) + 1;
        }
      });
      setVersionDistribution(versionDist);

      // Update frequency analysis
      const updateFreq = {
        'Last 30 days': 0,
        '1-3 months': 0,
        '3-6 months': 0,
        '6-12 months': 0,
        'Over 1 year': 0
      };

      const now = new Date();
      plugins.forEach(plugin => {
        if (plugin.last_updated) {
          const updatedDate = new Date(plugin.last_updated);
          const diffDays = Math.floor((now - updatedDate) / (1000 * 60 * 60 * 24));

          if (diffDays <= 30) updateFreq['Last 30 days']++;
          else if (diffDays <= 90) updateFreq['1-3 months']++;
          else if (diffDays <= 180) updateFreq['3-6 months']++;
          else if (diffDays <= 365) updateFreq['6-12 months']++;
          else updateFreq['Over 1 year']++;
        }
      });
      setUpdateFrequency(updateFreq);

      // Update tag competitor data if a tag is selected
      if (selectedTagForAnalytics && pluginsByCategory[selectedTagForAnalytics]) {
        updateTagCompetitorData(selectedTagForAnalytics);
      }

      // Set analytics data based on current selection
      updateAnalyticsDataByType(analyticsType);
    }
  }, [plugins, analyticsType, selectedTagForAnalytics]);

  // Function to update tag competitor data
  const updateTagCompetitorData = useCallback((tag) => {
    if (!pluginsByCategory[tag]) return;

    const competitorPlugins = pluginsByCategory[tag];
    // Sort plugins by active installs for comparison
    const sortedPlugins = [...competitorPlugins].sort((a, b) => b.active_installs - a.active_installs);

    setTagCompetitorData(sortedPlugins);
  }, [pluginsByCategory]);

  // Function to update analytics data based on selected type
  const updateAnalyticsDataByType = useCallback((type) => {
    let data = [];

    if (plugins.length === 0) return;

    switch (type) {
      case 'rating':
        // Rating distribution
        const ratingGroups = {
          '5 stars': 0,
          '4-4.9 stars': 0,
          '3-3.9 stars': 0,
          '2-2.9 stars': 0,
          '1-1.9 stars': 0,
          'Unrated': 0
        };

        plugins.forEach(plugin => {
          const rating = plugin.rating ? (plugin.rating / 100 * 5) : 0;
          if (rating === 0) ratingGroups['Unrated']++;
          else if (rating >= 4.9) ratingGroups['5 stars']++;
          else if (rating >= 4) ratingGroups['4-4.9 stars']++;
          else if (rating >= 3) ratingGroups['3-3.9 stars']++;
          else if (rating >= 2) ratingGroups['2-2.9 stars']++;
          else ratingGroups['1-1.9 stars']++;
        });

        data = Object.entries(ratingGroups).map(([label, value]) => ({
          label,
          value,
          color: label === '5 stars' ? '#4CAF50' :
                 label === '4-4.9 stars' ? '#8BC34A' :
                 label === '3-3.9 stars' ? '#FFEB3B' :
                 label === '2-2.9 stars' ? '#FF9800' :
                 label === '1-1.9 stars' ? '#F44336' : '#9E9E9E'
        }));
        break;

      case 'installs':
        // Installation tiers
        const installGroups = {
          '1M+': 0,
          '100k-1M': 0,
          '10k-100k': 0,
          '1k-10k': 0,
          '<1k': 0
        };

        plugins.forEach(plugin => {
          const installs = plugin.active_installs || 0;
          if (installs >= 1000000) installGroups['1M+']++;
          else if (installs >= 100000) installGroups['100k-1M']++;
          else if (installs >= 10000) installGroups['10k-100k']++;
          else if (installs >= 1000) installGroups['1k-10k']++;
          else installGroups['<1k']++;
        });

        data = Object.entries(installGroups).map(([label, value]) => ({
          label,
          value,
          color: label === '1M+' ? '#2196F3' :
                 label === '100k-1M' ? '#03A9F4' :
                 label === '10k-100k' ? '#00BCD4' :
                 label === '1k-10k' ? '#4DD0E1' : '#B2EBF2'
        }));
        break;

      case 'updates':
        // Update frequency
        data = Object.entries(updateFrequency).map(([label, value]) => ({
          label,
          value,
          color: label === 'Last 30 days' ? '#673AB7' :
                 label === '1-3 months' ? '#9575CD' :
                 label === '3-6 months' ? '#B39DDB' :
                 label === '6-12 months' ? '#D1C4E9' : '#EDE7F6'
        }));
        break;

      case 'versions':
        // WordPress version compatibility
        data = Object.entries(versionDistribution)
          .sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]))
          .map(([label, value], index) => ({
            label: `WP ${label}`,
            value,
            color: `hsl(180, ${80 - (index * 8)}%, ${50 + (index * 3)}%)`
          }));
        break;

      case 'tags':
        // Top tags distribution (get top 10 tags)
        const tagData = Object.entries(pluginsByCategory)
          .map(([tag, plugins]) => ({ tag, count: plugins.length }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);

        data = tagData.map((item, index) => ({
          label: item.tag,
          value: item.count,
          color: `hsl(${210 + (index * 15)}, 70%, 60%)`
        }));
        break;
    }

    setAnalyticsData(data);
  }, [plugins, updateFrequency, versionDistribution, pluginsByCategory]);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    if (inputSearch.trim()) {
      // Add to search history
      setSearchHistory(prev => {
        const newHistory = [
          {
            term: inputSearch,
            type: searchType,
            date: new Date().toISOString()
          },
          ...prev.filter(item => !(item.term === inputSearch && item.type === searchType))
        ];
        return newHistory.slice(0, 20);
      });

      setSearchTerm(inputSearch);
      setPage(1); // Reset to first page on new search
      setInputSearch("");
    }
  }, [inputSearch, searchType]);

  const handleCopy = useCallback((text) => {
    setSearchType("author");
    setSearchTerm(text);
    setPage(1); // Reset to first page
  }, []);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  }, []);

  const handleToggleFavorite = useCallback((slug) => {
    setFavorites(prev => {
      if (prev.includes(slug)) {
        return prev.filter(item => item !== slug);
      } else {
        return [...prev, slug];
      }
    });
  }, []);

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

  // Filter and sort plugins
  const filteredAndSortedPlugins = useMemo(() => {
    return plugins
      .filter(plugin => {
        // Filter by minimum rating
        if (minRating > 0 && (!plugin.rating || plugin.rating / 100 * 5 < minRating)) {
          return false;
        }

        // Filter by WordPress version compatibility
        if (wpVersionFilter && plugin.tested &&
            parseFloat(plugin.tested) < parseFloat(wpVersionFilter)) {
          return false;
        }

        // Filter by active installs range
        if (installsRange[0] > 0 && plugin.active_installs < installsRange[0]) {
          return false;
        }

        if (installsRange[1] < 5000000 && plugin.active_installs > installsRange[1]) {
          return false;
        }

        // Filter by selected tags if any
        if (selectedTags.length > 0 && plugin.tags) {
          if (!selectedTags.some(tag => plugin.tags[tag])) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        // Sort by specified field
        if (sortBy === "active_installs") {
          return sortOrder === "desc" ?
            b.active_installs - a.active_installs :
            a.active_installs - b.active_installs;
        } else if (sortBy === "rating") {
          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;
          return sortOrder === "desc" ? ratingB - ratingA : ratingA - ratingB;
        } else if (sortBy === "last_updated") {
          const dateA = new Date(a.last_updated);
          const dateB = new Date(b.last_updated);
          return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
        } else if (sortBy === "name") {
          return sortOrder === "desc" ?
            b.name.localeCompare(a.name) :
            a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [plugins, minRating, wpVersionFilter, installsRange, sortBy, sortOrder, selectedTags]);

  // Function to export results as CSV
  const handleExportCSV = useCallback(() => {
    const headers = ['Name', 'Author', 'Rating', 'Active Installs', 'Version', 'WordPress Version', 'Last Updated'];
    const csvContent = [
      headers.join(','),
      ...filteredAndSortedPlugins.map(plugin => [
        `"${plugin.name.replace(/"/g, '""')}"`,
        `"${plugin.author}"`,
        (plugin.rating ? (plugin.rating / 100 * 5).toFixed(1) : '0'),
        plugin.active_installs,
        plugin.version,
        plugin.tested || 'N/A',
        plugin.last_updated
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `wordpress-plugins-${getPageTitleForCSV()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSnackbarMessage("CSV file downloaded successfully");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  }, [filteredAndSortedPlugins]);

  // Extract and count tags from all plugins
  useEffect(() => {
    if (plugins.length > 0) {
      const tagCounts = {};
      plugins.forEach(plugin => {
        if (plugin.tags) {
          Object.keys(plugin.tags).forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          });
        }
      });

      // Convert to array and sort by count
      const tagArray = Object.entries(tagCounts)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20); // Get top 20 tags

      setPluginTags(tagArray);
    }
  }, [plugins]);

  // Memoized function for page title (for display)
  const getPageTitle = useCallback(() => {
    if (showFavoritesOnly) return "Favorites";
    if (!searchTerm) return "New";
    if (searchType === "author") return `Author: ${searchTerm}`;
    if (searchType === "name") return `Name: ${searchTerm}`;
    if (searchType === "tag") return `Tag: ${searchTerm}`;
    return searchTerm;
  }, [showFavoritesOnly, searchTerm, searchType]);

  // Memoized plugin card renderer
  const renderPluginCard = useCallback((plugin, index) => {
    const localRank = index + 1;
    const username = plugin.author_profile
      ? plugin.author_profile.split("/").filter(Boolean).pop()
      : "Unknown";
    const isFavorite = favorites.includes(plugin.slug);

    // Calculate display rating out of 5
    const displayRating = plugin.rating ? (plugin.rating / 100 * 5) : 0;

    return (
      <Grid item key={plugin.slug} xs={12} sm={6} md={4}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <Box sx={{ position: 'absolute', top: 12, left: 12, zIndex: 1 }}>
            <Chip
              label={`#${localRank}`}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 'bold' }}
            />
          </Box>

          <IconButton
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 1,
              backgroundColor: 'rgba(255,255,255,0.8)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' }
            }}
            size="small"
            onClick={() => handleToggleFavorite(plugin.slug)}
          >
            {isFavorite ? "❤️" : "🤍"}
          </IconButton>

          <Box sx={{
            height: 140,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f9f9f9',
            padding: 2,
            borderBottom: '1px solid #eee'
          }}>
            <CardMedia
              component="img"
              image={
                plugin.icons
                  ? plugin.icons["2x"] ||
                    plugin.icons["1x"] ||
                    plugin.icons.default
                  : "https://ps.w.org/classic-editor/assets/icon-256x256.png?rev=1998671"
              }
              alt={plugin.name}
              sx={{ maxHeight: '100%', width: 'auto', maxWidth: '80%', objectFit: 'contain' }}
            />
          </Box>

          <CardContent sx={{ flexGrow: 1, pt: 2, px: 2, pb: 2 }}>
            <Typography variant="h6" component="div" gutterBottom noWrap title={plugin.name}>
              {plugin.name.replace(/&#8211;/g, "-").replace(/&amp;/g, "&")}
            </Typography>

            {displayRating > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Rating value={displayRating} readOnly precision={0.5} size="small" />
                <Typography variant="body2" color="text.secondary" ml={0.5}>
                  ({plugin.num_ratings})
                </Typography>
              </Box>
            )}

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                height: '3em',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {plugin.short_description}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
              <Chip
                label={formatActiveInstalls(plugin.active_installs)}
                size="small"
                color={plugin.active_installs > 10000 ? "success" : "default"}
                sx={{ fontWeight: 500 }}
              />
              <Chip
                label={`v${plugin.version}`}
                size="small"
                variant="outlined"
              />
              {plugin.tested && (
                <Chip
                  label={`WP ${plugin.tested}`}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              )}
            </Stack>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              <strong>Author:</strong> <span onClick={() => handleCopy(username)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>{username}</span>
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              <strong>Age:</strong> {calculatePluginAge(plugin.added)}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              <strong>Updated:</strong> {calculateLastUpdated(plugin.last_updated)}
            </Typography>
          </CardContent>

          <Box sx={{ p: 2, pt: 0 }}>
            <Button
              variant="contained"
              size="medium"
              href={`https://wordpress.org/plugins/${plugin.slug}`}
              target="_blank"
              fullWidth
            >
              View Plugin
            </Button>

            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleAddToCompare(plugin)}
                sx={{ flex: 1 }}
              >
                Compare
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleViewPluginDetails(plugin)}
                sx={{ flex: 1 }}
              >
                Details
              </Button>
            </Stack>
          </Box>
        </Card>
      </Grid>
    );
  }, [favorites, calculatePluginAge, calculateLastUpdated, formatActiveInstalls, handleCopy, handleToggleFavorite, handleAddToCompare, handleViewPluginDetails]);

  // Function to render analytics charts
  const renderAnalyticsChart = useCallback(() => {
    if (analyticsData.length === 0) {
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1">No data available for analysis</Typography>
        </Box>
      );
    }

    const total = analyticsData.reduce((sum, item) => sum + item.value, 0);

    // Simple horizontal bar chart
    return (
      <Box sx={{ p: 2 }}>
        {analyticsData.map((item, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="body2" sx={{ minWidth: 120 }}>
                {item.label}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                {item.value} ({Math.round(item.value / total * 100)}%)
              </Typography>
            </Box>
            <Box
              sx={{
                height: 24,
                width: '100%',
                bgcolor: 'background.paper',
                borderRadius: 1,
                overflow: 'hidden',
                border: '1px solid rgba(0,0,0,0.1)'
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  width: `${(item.value / total * 100)}%`,
                  bgcolor: item.color,
                  transition: 'width 1s ease-in-out'
                }}
              />
            </Box>
          </Box>
        ))}
      </Box>
    );
  }, [analyticsData]);

  // Function to render top plugins in each category
  const renderTopPlugins = useCallback((category) => {
    if (!topPlugins[category] || topPlugins[category].length === 0) {
      return <Typography variant="body1">No data available</Typography>;
    }

    return (
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>Plugin</TableCell>
              <TableCell align="right">
                {category === 'installs' ? 'Active Installs' :
                 category === 'rating' ? 'Rating' :
                 category === 'age' ? 'Age' : 'Last Updated'}
              </TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topPlugins[category].map((plugin, index) => (
              <TableRow key={plugin.slug}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      component="img"
                      src={
                        plugin.icons
                          ? plugin.icons["1x"] ||
                            plugin.icons.default
                          : "https://ps.w.org/classic-editor/assets/icon-128x128.png?rev=1998671"
                      }
                      alt={plugin.name}
                      sx={{ width: 24, height: 24, mr: 1 }}
                    />
                    <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>
                      {plugin.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  {category === 'installs' ? formatActiveInstalls(plugin.active_installs) :
                   category === 'rating' ? `${(plugin.rating / 100 * 5).toFixed(1)}` :
                   category === 'age' ? calculatePluginAge(plugin.added) :
                   calculateLastUpdated(plugin.last_updated).split(' at')[0]}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleViewPluginDetails(plugin)}
                    title="View Details"
                  >
                    👁️
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleAddToCompare(plugin)}
                    title="Compare"
                  >
                    🔄
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }, [topPlugins, formatActiveInstalls, calculatePluginAge, calculateLastUpdated, handleViewPluginDetails, handleAddToCompare]);

  // Function to render competitor analytics by tag
  const renderTagCompetitorAnalytics = useCallback(() => {
    if (!selectedTagForAnalytics || tagCompetitorData.length === 0) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">
            Select a tag category to view competitor analytics
          </Typography>

          <Box sx={{ mt: 2 }}>
            <FormControl variant="outlined" sx={{ minWidth: 200 }}>
              <InputLabel>Select Tag Category</InputLabel>
              <Select
                value={selectedTagForAnalytics}
                onChange={(e) => {
                  const tag = e.target.value;
                  setSelectedTagForAnalytics(tag);
                  updateTagCompetitorData(tag);
                }}
                label="Select Tag Category"
              >
                <MenuItem value="">None</MenuItem>
                {Object.keys(pluginsByCategory)
                  .sort((a, b) => pluginsByCategory[b].length - pluginsByCategory[a].length)
                  .slice(0, 20)
                  .map(tag => (
                    <MenuItem key={tag} value={tag}>
                      {tag} ({pluginsByCategory[tag].length})
                    </MenuItem>
                  ))
                }
              </Select>
            </FormControl>
          </Box>
        </Box>
      );
    }

    return (
      <Box sx={{ p: 2 }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1">
            Competitor Analysis: {tagCompetitorData.length} plugins in "{selectedTagForAnalytics}" category
          </Typography>
          <Box>
            <Button
              variant="outlined"
              size="small"
              onClick={handleOpenGrowthAnalytics}
              startIcon="📈"
            >
              Growth Trends
            </Button>
            <Button
              variant="text"
              size="small"
              onClick={handleGenerateDemoData}
              sx={{ ml: 1 }}
            >
              Generate Demo Data
            </Button>
          </Box>
        </Box>

        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>Plugin</TableCell>
                <TableCell>Author</TableCell>
                <TableCell align="right">Installs</TableCell>
                <TableCell align="right">Rating</TableCell>
                <TableCell align="right">Last Updated</TableCell>
                <TableCell align="right">Version</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tagCompetitorData.map((plugin, index) => (
                <TableRow key={plugin.slug}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        component="img"
                        src={
                          plugin.icons
                            ? plugin.icons["1x"] ||
                              plugin.icons.default
                            : "https://ps.w.org/classic-editor/assets/icon-128x128.png?rev=1998671"
                        }
                        alt={plugin.name}
                        sx={{ width: 24, height: 24, mr: 1 }}
                      />
                      <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                        {plugin.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{plugin.author_profile?.split("/").filter(Boolean).pop() || 'Unknown'}</TableCell>
                  <TableCell align="right">{formatActiveInstalls(plugin.active_installs)}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      {plugin.rating ? (plugin.rating / 100 * 5).toFixed(1) : '0'}
                      <Typography variant="caption" color="text.secondary" ml={0.5}>
                        ({plugin.num_ratings})
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">{calculateLastUpdated(plugin.last_updated).split(' at')[0]}</TableCell>
                  <TableCell align="right">{plugin.version}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleViewPluginDetails(plugin)}
                      title="View Details"
                    >
                      👁️
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleAddToCompare(plugin)}
                      title="Compare"
                    >
                      🔄
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>Key Insights:</Typography>
          <Box sx={{ ml: 2 }}>
            <Typography variant="body2" gutterBottom>• Market leader: {tagCompetitorData[0]?.name} with {formatActiveInstalls(tagCompetitorData[0]?.active_installs)} active installs</Typography>

            <Typography variant="body2" gutterBottom>
              • Highest rated: {
                [...tagCompetitorData]
                  .filter(p => p.rating > 0)
                  .sort((a, b) => b.rating - a.rating)[0]?.name
              } ({
                (([...tagCompetitorData]
                  .filter(p => p.rating > 0)
                  .sort((a, b) => b.rating - a.rating)[0]?.rating || 0) / 100 * 5
                ).toFixed(1)
              } stars)
            </Typography>

            <Typography variant="body2" gutterBottom>
              • Most recently updated: {
                [...tagCompetitorData]
                  .sort((a, b) => new Date(b.last_updated) - new Date(a.last_updated))[0]?.name
              } ({
                calculateLastUpdated([...tagCompetitorData]
                  .sort((a, b) => new Date(b.last_updated) - new Date(a.last_updated))[0]?.last_updated).split(' at')[0]
              })
            </Typography>

            <Typography variant="body2">
              • Average installs in this category: {
                formatActiveInstalls(
                  Math.round(
                    tagCompetitorData.reduce((sum, p) => sum + p.active_installs, 0) / tagCompetitorData.length
                  )
                )
              }
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }, [selectedTagForAnalytics, tagCompetitorData, pluginsByCategory, formatActiveInstalls, calculateLastUpdated, handleViewPluginDetails, handleAddToCompare, updateTagCompetitorData]);

  // Save growth history data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('wpPluginGrowthHistory', JSON.stringify(growthHistoryData));
  }, [growthHistoryData]);

  // Function to track and record plugin growth
  const trackPluginGrowth = useCallback((plugin) => {
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const currentMonth = currentDate.substring(0, 7); // YYYY-MM format

    setGrowthHistoryData(prev => {
      const newData = { ...prev };

      if (!newData[plugin.slug]) {
        newData[plugin.slug] = {
          name: plugin.name,
          dataPoints: []
        };
      }

      // Check if we already have a data point for this month
      const existingPointIndex = newData[plugin.slug].dataPoints.findIndex(
        dp => dp.date.startsWith(currentMonth)
      );

      const newDataPoint = {
        date: currentDate,
        active_installs: plugin.active_installs,
        rating: plugin.rating ? (plugin.rating / 100 * 5) : 0,
        num_ratings: plugin.num_ratings || 0
      };

      if (existingPointIndex >= 0) {
        // Update existing data point for this month
        newData[plugin.slug].dataPoints[existingPointIndex] = newDataPoint;
      } else {
        // Add new data point
        newData[plugin.slug].dataPoints.push(newDataPoint);
      }

      // Sort data points by date
      newData[plugin.slug].dataPoints.sort((a, b) => new Date(a.date) - new Date(b.date));

      return newData;
    });
  }, []);

  // Track growth for viewed plugin details
  useEffect(() => {
    if (selectedPlugin) {
      trackPluginGrowth(selectedPlugin);
    }
  }, [selectedPlugin, trackPluginGrowth]);

  // Calculate growth rates for plugins
  const calculateGrowthData = useCallback((pluginSlugs, timeframe) => {
    if (!pluginSlugs || pluginSlugs.length === 0) return {};

    const result = {};
    const currentDate = new Date();
    let compareDate;

    switch (timeframe) {
      case "7days":
        compareDate = new Date(currentDate);
        compareDate.setDate(compareDate.getDate() - 7);
        break;
      case "15days":
        compareDate = new Date(currentDate);
        compareDate.setDate(compareDate.getDate() - 15);
        break;
      case "1month":
        compareDate = new Date(currentDate);
        compareDate.setMonth(compareDate.getMonth() - 1);
        break;
      case "3months":
        compareDate = new Date(currentDate);
        compareDate.setMonth(compareDate.getMonth() - 3);
        break;
      case "6months":
        compareDate = new Date(currentDate);
        compareDate.setMonth(compareDate.getMonth() - 6);
        break;
      case "1year":
        compareDate = new Date(currentDate);
        compareDate.setFullYear(compareDate.getFullYear() - 1);
        break;
      default:
        compareDate = new Date(currentDate);
        compareDate.setMonth(compareDate.getMonth() - 6);
    }

    const compareDateStr = compareDate.toISOString().split('T')[0];

    pluginSlugs.forEach(slug => {
      if (!growthHistoryData[slug]) return;

      const pluginData = growthHistoryData[slug];
      const dataPoints = pluginData.dataPoints;

      if (dataPoints.length < 2) {
        result[slug] = {
          name: pluginData.name,
          growthRate: null,
          message: "Insufficient data - need at least 2 data points",
          currentInstalls: dataPoints.length > 0 ? dataPoints[dataPoints.length - 1].active_installs : 0,
          previousInstalls: 0,
          dataPoints: dataPoints
        };
        return;
      }

      // Get most recent data point
      const currentDataPoint = dataPoints[dataPoints.length - 1];

      // Find closest data point to compare date
      let closestPreviousPoint = dataPoints[0];
      let minDiff = Math.abs(new Date(closestPreviousPoint.date) - compareDate);

      for (let i = 1; i < dataPoints.length - 1; i++) {
        const diff = Math.abs(new Date(dataPoints[i].date) - compareDate);
        if (diff < minDiff) {
          minDiff = diff;
          closestPreviousPoint = dataPoints[i];
        }
      }

      const currentInstalls = currentDataPoint.active_installs;
      const previousInstalls = closestPreviousPoint.active_installs;

      // Calculate growth rate
      const growthRate = previousInstalls > 0
        ? ((currentInstalls - previousInstalls) / previousInstalls) * 100
        : 0;

      // Calculate monthly rates for chart
      const monthlyRates = [];
      if (dataPoints.length > 1) {
        // Group data points by month
        const monthlyData = {};
        dataPoints.forEach(dp => {
          const month = dp.date.substring(0, 7); // YYYY-MM
          monthlyData[month] = dp;
        });

        // Convert to array and sort
        const months = Object.keys(monthlyData).sort();

        // Calculate month-to-month growth
        for (let i = 1; i < months.length; i++) {
          const currentMonth = monthlyData[months[i]];
          const prevMonth = monthlyData[months[i-1]];

          const monthlyRate = prevMonth.active_installs > 0
            ? ((currentMonth.active_installs - prevMonth.active_installs) / prevMonth.active_installs) * 100
            : 0;

          monthlyRates.push({
            month: months[i],
            rate: monthlyRate,
            installs: currentMonth.active_installs
          });
        }
      }

      result[slug] = {
        name: pluginData.name,
        growthRate: growthRate.toFixed(2),
        monthlyRates,
        currentInstalls,
        previousInstalls,
        currentRating: currentDataPoint.rating,
        previousRating: closestPreviousPoint.rating,
        ratingGrowth: ((currentDataPoint.rating - closestPreviousPoint.rating) / Math.max(0.1, closestPreviousPoint.rating) * 100).toFixed(2),
        reviewGrowth: ((currentDataPoint.num_ratings - closestPreviousPoint.num_ratings) / Math.max(1, closestPreviousPoint.num_ratings) * 100).toFixed(2),
        dataPoints,
        timePeriod: `${closestPreviousPoint.date} to ${currentDataPoint.date}`
      };
    });

    return result;
  }, [growthHistoryData]);

  // Function to render growth charts
  const renderGrowthCharts = useCallback(() => {
    if (Object.keys(growthAnalyticsData).length === 0) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">No growth data available</Typography>
        </Box>
      );
    }

    // Get all plugins with growth data
    const plugins = Object.keys(growthAnalyticsData).map(slug => ({
      slug,
      name: growthAnalyticsData[slug].name,
      growthRate: parseFloat(growthAnalyticsData[slug].growthRate) || 0
    }));

    // Sort by growth rate
    const sortedPlugins = plugins.sort((a, b) => b.growthRate - a.growthRate);

    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Monthly Growth Comparison</Typography>

        {/* Growth rate comparison bar chart */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" gutterBottom>Overall Growth Rate Comparison</Typography>
          {sortedPlugins.map(plugin => {
            const data = growthAnalyticsData[plugin.slug];
            if (!data.growthRate || data.growthRate === "NaN") return null;

            const growthRate = parseFloat(data.growthRate);
            const barColor = growthRate >= 0 ?
              (growthRate > 25 ? '#4CAF50' : '#8BC34A') :
              (growthRate < -25 ? '#F44336' : '#FF9800');

            return (
              <Box key={plugin.slug} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">{data.name}</Typography>
                  <Typography variant="body2" sx={{
                    fontWeight: 'bold',
                    color: growthRate >= 0 ? 'success.main' : 'error.main'
                  }}>
                    {growthRate >= 0 ? '+' : ''}{data.growthRate}%
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', height: 24 }}>
                  <Box sx={{
                    width: '50%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    pr: 0.5
                  }}>
                    {growthRate < 0 && (
                      <Box sx={{
                        height: 16,
                        width: `${Math.min(Math.abs(growthRate), 100) / 2}%`,
                        maxWidth: '100%',
                        bgcolor: barColor,
                        borderRadius: '4px 0 0 4px'
                      }} />
                    )}
                  </Box>
                  <Box sx={{ width: 2, height: '100%', bgcolor: 'divider' }} />
                  <Box sx={{
                    width: '50%',
                    height: '100%',
                    pl: 0.5
                  }}>
                    {growthRate >= 0 && (
                      <Box sx={{
                        height: 16,
                        width: `${Math.min(growthRate, 100) / 2}%`,
                        maxWidth: '100%',
                        bgcolor: barColor,
                        borderRadius: '0 4px 4px 0'
                      }} />
                    )}
                  </Box>
                </Box>
                <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mt: 0.5 }}>
                  {formatActiveInstalls(data.previousInstalls)} → {formatActiveInstalls(data.currentInstalls)}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* Monthly growth trends for selected plugins */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle2" gutterBottom>Monthly Installation Trends</Typography>

          {Object.keys(growthAnalyticsData).length > 0 ? (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Plugin</TableCell>
                    <TableCell align="right">Active Installs</TableCell>
                    <TableCell align="right">Monthly Growth</TableCell>
                    <TableCell align="right">Rating Growth</TableCell>
                    <TableCell align="right">Review Growth</TableCell>
                    <TableCell align="right">Period</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedPlugins.map(plugin => {
                    const data = growthAnalyticsData[plugin.slug];
                    return (
                      <TableRow key={plugin.slug}>
                        <TableCell>{data.name}</TableCell>
                        <TableCell align="right">{formatActiveInstalls(data.currentInstalls)}</TableCell>
                        <TableCell align="right">
                          <Typography sx={{
                            color: parseFloat(data.growthRate) >= 0 ? 'success.main' : 'error.main',
                            fontWeight: 'bold'
                          }}>
                            {parseFloat(data.growthRate) >= 0 ? '+' : ''}{data.growthRate}%
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography sx={{
                            color: parseFloat(data.ratingGrowth) >= 0 ? 'success.main' : 'error.main'
                          }}>
                            {parseFloat(data.ratingGrowth) >= 0 ? '+' : ''}{data.ratingGrowth}%
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography sx={{
                            color: parseFloat(data.reviewGrowth) >= 0 ? 'success.main' : 'error.main'
                          }}>
                            {parseFloat(data.reviewGrowth) >= 0 ? '+' : ''}{data.reviewGrowth}%
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="caption">{data.timePeriod}</Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2">No monthly trend data available</Typography>
          )}
        </Box>
      </Box>
    );
  }, [growthAnalyticsData, formatActiveInstalls]);

  // Function to open growth analytics dialog
  const handleOpenGrowthAnalytics = useCallback(() => {
    // If there are plugins in tag competitor data, offer those as options
    if (tagCompetitorData.length > 0) {
      // Track growth data for top competitors
      const topCompetitors = tagCompetitorData.slice(0, 5);
      topCompetitors.forEach(plugin => {
        trackPluginGrowth(plugin);
      });

      // Prepare slugs for growth analysis
      const competitorSlugs = topCompetitors.map(p => p.slug);

      // Update selected plugins for growth
      setSelectedPluginsForGrowth(competitorSlugs);

      // Calculate growth data
      const growthData = calculateGrowthData(competitorSlugs, growthTimeframe);
      setGrowthAnalyticsData(growthData);
    } else if (Object.keys(growthHistoryData).length > 0) {
      // Otherwise use all plugins that have history data
      const pluginSlugsWithHistory = Object.keys(growthHistoryData)
        .filter(slug => growthHistoryData[slug].dataPoints.length > 1)
        .slice(0, 10); // Limit to 10 plugins

      setSelectedPluginsForGrowth(pluginSlugsWithHistory);

      // Calculate growth data
      const growthData = calculateGrowthData(pluginSlugsWithHistory, growthTimeframe);
      setGrowthAnalyticsData(growthData);
    }

    setShowGrowthAnalytics(true);
  }, [tagCompetitorData, growthHistoryData, trackPluginGrowth, calculateGrowthData, growthTimeframe]);

  // Function to handle timeframe change
  const handleTimeframeChange = useCallback((newTimeframe) => {
    setGrowthTimeframe(newTimeframe);
    const growthData = calculateGrowthData(selectedPluginsForGrowth, newTimeframe);
    setGrowthAnalyticsData(growthData);
  }, [calculateGrowthData, selectedPluginsForGrowth]);

  // Function to get fake history data for demo purposes
  const generateDemoGrowthData = useCallback((plugin) => {
    const currentDate = new Date();
    const dataPoints = [];

    // Create data points for the last year with more frequent recent points
    // Last 7 days - daily data
    for (let i = 6; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);

      // Generate installs based on previous point or starting value
      let baseInstalls = i === 6 ?
        Math.round(plugin.active_installs * 0.97) : // Start with 97% of current installs a week ago
        dataPoints[dataPoints.length - 1].active_installs;

      // Daily growth rate between 0.1-0.5%
      const growthRate = 1 + (Math.random() * 0.004 + 0.001);
      baseInstalls = Math.round(baseInstalls * growthRate);

      dataPoints.push({
        date: date.toISOString().split('T')[0],
        active_installs: baseInstalls,
        rating: Math.max(1, Math.min(5, plugin.rating ? (plugin.rating / 100 * 5) * (0.998 + Math.random() * 0.004) : 3.5)),
        num_ratings: Math.round((plugin.num_ratings || 100) * (1 + (Math.random() * 0.002)))
      });
    }

    // Past points - bi-weekly for past 2 months
    for (let i = 8; i >= 1; i--) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - (7 + i * 7)); // Go back additional weeks

      // Calculate previous install baseline (90-95% of current for each month back)
      const weeksAgo = 1 + i / 4; // Approximate months
      const reductionFactor = Math.pow(0.97, weeksAgo);
      const baseInstalls = Math.round(plugin.active_installs * reductionFactor);

      dataPoints.unshift({
        date: date.toISOString().split('T')[0],
        active_installs: baseInstalls,
        rating: Math.max(1, Math.min(5, plugin.rating ? (plugin.rating / 100 * 5) * (0.95 + Math.random() * 0.1) : 3.5)),
        num_ratings: Math.round((plugin.num_ratings || 100) * Math.pow(0.98, weeksAgo) * (1 + (Math.random() * 0.02)))
      });
    }

    // Monthly data for remaining historical data
    for (let i = 11; i >= 3; i--) {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - i);

      // Calculate previous install baseline (80-90% of current for each month back)
      const reductionFactor = Math.pow(0.92, i);
      const baseInstalls = Math.round(plugin.active_installs * reductionFactor);

      dataPoints.unshift({
        date: date.toISOString().split('T')[0],
        active_installs: baseInstalls,
        rating: Math.max(1, Math.min(5, plugin.rating ? (plugin.rating / 100 * 5) * (0.9 + Math.random() * 0.1) : 3.5)),
        num_ratings: Math.round((plugin.num_ratings || 100) * reductionFactor * (1 - (Math.random() * 0.1)))
      });
    }

    // Sort data points by date
    dataPoints.sort((a, b) => new Date(a.date) - new Date(b.date));

    return {
      name: plugin.name,
      dataPoints
    };
  }, []);

  // Function to generate demo history data
  const handleGenerateDemoData = useCallback(() => {
    // Only generate for top competitors if we have them
    if (tagCompetitorData.length > 0) {
      const newHistoryData = {};

      // Generate demo data for top competitors
      tagCompetitorData.slice(0, 5).forEach(plugin => {
        newHistoryData[plugin.slug] = generateDemoGrowthData(plugin);
      });

      // Update history data
      setGrowthHistoryData(prev => ({ ...prev, ...newHistoryData }));

      // Update selected plugins
      const pluginSlugs = Object.keys(newHistoryData);
      setSelectedPluginsForGrowth(pluginSlugs);

      // Calculate growth data
      const growthData = calculateGrowthData(pluginSlugs, growthTimeframe);
      setGrowthAnalyticsData(growthData);

      setSnackbarMessage("Demo growth data generated for analysis");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } else {
      setSnackbarMessage("Select a tag category first to generate demo data");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
    }
  }, [tagCompetitorData, generateDemoGrowthData, growthTimeframe, calculateGrowthData]);

  // Function to render growth trend chart for a specific plugin
  const renderGrowthTrendChart = useCallback(() => {
    if (!selectedPluginForTrend || !growthHistoryData[selectedPluginForTrend]) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography>Select a plugin to view detailed growth trend</Typography>
        </Box>
      );
    }

    const pluginData = growthHistoryData[selectedPluginForTrend];
    const dataPoints = [...pluginData.dataPoints].sort((a, b) => new Date(a.date) - new Date(b.date));

    if (dataPoints.length < 2) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography>Not enough data points to display trend</Typography>
        </Box>
      );
    }

    // Calculate growth percentages between consecutive data points
    const growthData = [];
    for (let i = 1; i < dataPoints.length; i++) {
      const prevPoint = dataPoints[i-1];
      const currPoint = dataPoints[i];

      const growthRate = prevPoint.active_installs > 0
        ? ((currPoint.active_installs - prevPoint.active_installs) / prevPoint.active_installs) * 100
        : 0;

      growthData.push({
        date: currPoint.date,
        growth: growthRate.toFixed(2),
        prevDate: prevPoint.date,
        installs: currPoint.active_installs,
        prevInstalls: prevPoint.active_installs
      });
    }

    // Find min and max values for scaling
    const maxInstalls = Math.max(...dataPoints.map(p => p.active_installs));
    const minInstalls = Math.min(...dataPoints.map(p => p.active_installs));
    const range = maxInstalls - minInstalls;

    // Calculate the scale for the chart (80% of height)
    const getScaledHeight = (installs) => {
      return 10 + ((installs - minInstalls) / range) * 80;
    };

    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Growth Trend for {pluginData.name}
        </Typography>

        <Box sx={{ height: 300, mt: 3, mb: 4, position: 'relative' }}>
          {/* Y-axis labels */}
          <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 60, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Typography variant="caption" sx={{ textAlign: 'right', pr: 1 }}>
              {formatActiveInstalls(maxInstalls)}
            </Typography>
            <Typography variant="caption" sx={{ textAlign: 'right', pr: 1 }}>
              {formatActiveInstalls(Math.round(minInstalls + range * 0.75))}
            </Typography>
            <Typography variant="caption" sx={{ textAlign: 'right', pr: 1 }}>
              {formatActiveInstalls(Math.round(minInstalls + range * 0.5))}
            </Typography>
            <Typography variant="caption" sx={{ textAlign: 'right', pr: 1 }}>
              {formatActiveInstalls(Math.round(minInstalls + range * 0.25))}
            </Typography>
            <Typography variant="caption" sx={{ textAlign: 'right', pr: 1 }}>
              {formatActiveInstalls(minInstalls)}
            </Typography>
          </Box>

          {/* Chart area */}
          <Box sx={{
            position: 'absolute',
            left: 60,
            right: 0,
            top: 0,
            bottom: 0,
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: 1,
            overflow: 'hidden'
          }}>
            {/* Grid lines */}
            <Box sx={{ position: 'absolute', left: 0, right: 0, top: '20%', height: 1, bgcolor: 'rgba(0,0,0,0.05)' }} />
            <Box sx={{ position: 'absolute', left: 0, right: 0, top: '40%', height: 1, bgcolor: 'rgba(0,0,0,0.05)' }} />
            <Box sx={{ position: 'absolute', left: 0, right: 0, top: '60%', height: 1, bgcolor: 'rgba(0,0,0,0.05)' }} />
            <Box sx={{ position: 'absolute', left: 0, right: 0, top: '80%', height: 1, bgcolor: 'rgba(0,0,0,0.05)' }} />

            {/* Plot points and line */}
            <Box sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              px: 2,
              display: 'flex',
              alignItems: 'flex-end'
            }}>
              <svg width="100%" height="100%" viewBox={`0 0 ${dataPoints.length * 30} 100`} preserveAspectRatio="none">
                {/* Draw connecting line */}
                <polyline
                  points={dataPoints.map((point, i) =>
                    `${i * 30 + 15},${100 - getScaledHeight(point.active_installs)}`
                  ).join(' ')}
                  fill="none"
                  stroke="#1976d2"
                  strokeWidth="2"
                />

                {/* Draw data points */}
                {dataPoints.map((point, i) => (
                  <circle
                    key={i}
                    cx={i * 30 + 15}
                    cy={100 - getScaledHeight(point.active_installs)}
                    r="3"
                    fill="#1976d2"
                  />
                ))}
              </svg>
            </Box>
          </Box>
        </Box>

        {/* Data points table */}
        <TableContainer component={Paper} variant="outlined" sx={{ mt: 3 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date Range</TableCell>
                <TableCell align="right">Active Installs</TableCell>
                <TableCell align="right">Growth</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {growthData.map((point, index) => (
                <TableRow key={index}>
                  <TableCell>{point.prevDate} to {point.date}</TableCell>
                  <TableCell align="right">
                    {formatActiveInstalls(point.prevInstalls)} → {formatActiveInstalls(point.installs)}
                  </TableCell>
                  <TableCell align="right">
                    <Typography sx={{
                      fontWeight: 'medium',
                      color: parseFloat(point.growth) >= 0 ? 'success.main' : 'error.main'
                    }}>
                      {parseFloat(point.growth) >= 0 ? '+' : ''}{point.growth}%
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }, [selectedPluginForTrend, growthHistoryData, formatActiveInstalls]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            WordPress Plugin Explorer
          </Typography>

          <Typography variant="h6" color="text.secondary" gutterBottom>
            {getPageTitle()}
          </Typography>
        </Box>

        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Box
            component="form"
            onSubmit={handleSubmit}
          >
            <Grid container spacing={2} alignItems="center" justifyContent="center">
              <Grid item xs={12} sm={3} md={2}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel>Search By</InputLabel>
                  <Select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    label="Search By"
                    disabled={showFavoritesOnly}
                  >
                    <MenuItem value="author">Author</MenuItem>
                    <MenuItem value="name">Name</MenuItem>
                    <MenuItem value="tag">Tag</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <TextField
                  variant="outlined"
                  value={inputSearch}
                  onChange={(e) => setInputSearch(e.target.value)}
                  label={`Enter ${searchType}`}
                  fullWidth
                  disabled={showFavoritesOnly}
                />
              </Grid>

              <Grid item xs={6} sm={3} md={2}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={showFavoritesOnly}
                  size="large"
                  sx={{ height: '56px' }}
                >
                  Search
                </Button>
              </Grid>

              <Grid item xs={6} sm={12} md={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showFavoritesOnly}
                      onChange={(e) => {
                        setShowFavoritesOnly(e.target.checked);
                        if (e.target.checked) {
                          setPage(1);
                        }
                      }}
                      color="primary"
                    />
                  }
                  label="Show Favorites"
                  sx={{ ml: 0 }}
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', mt: 3, gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setShowFilters(!showFilters)}
                size="small"
                startIcon="🔍"
              >
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>

              <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Sort By"
                  size="small"
                >
                  <MenuItem value="active_installs">Active Installs</MenuItem>
                  <MenuItem value="rating">Rating</MenuItem>
                  <MenuItem value="last_updated">Last Updated</MenuItem>
                  <MenuItem value="name">Name</MenuItem>
                </Select>
              </FormControl>

              <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Order</InputLabel>
                <Select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  label="Order"
                  size="small"
                >
                  <MenuItem value="desc">Descending</MenuItem>
                  <MenuItem value="asc">Ascending</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {showFilters && (
              <Paper elevation={0} variant="outlined" sx={{ mt: 3, p: 3, borderRadius: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Advanced Filters
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Typography gutterBottom>Minimum Rating</Typography>
                    <Rating
                      value={minRating}
                      onChange={(event, newValue) => {
                        setMinRating(newValue);
                      }}
                      size="large"
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Typography gutterBottom>WordPress Compatibility</Typography>
                    <FormControl variant="outlined" fullWidth size="small">
                      <InputLabel>WP Version</InputLabel>
                      <Select
                        value={wpVersionFilter}
                        onChange={(e) => setWpVersionFilter(e.target.value)}
                        label="WP Version"
                      >
                        <MenuItem value="">Any Version</MenuItem>
                        <MenuItem value="6.3">WP 6.3+</MenuItem>
                        <MenuItem value="6.2">WP 6.2+</MenuItem>
                        <MenuItem value="6.1">WP 6.1+</MenuItem>
                        <MenuItem value="6.0">WP 6.0+</MenuItem>
                        <MenuItem value="5.9">WP 5.9+</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Typography gutterBottom>Active Installs Range</Typography>
                    <Box px={2}>
                      <Box>
                        <Slider
                          value={installsRange}
                          onChange={handleInstallsRangeChange}
                          valueLabelDisplay="auto"
                          valueLabelFormat={formatInstallValueText}
                          min={0}
                          max={5000000}
                          step={10}
                        />
                        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                          <TextField
                            size="small"
                            label="Min Installs"
                            type="number"
                            value={installsRange[0]}
                            onChange={(e) => handleInstallsRangeChange(null, [parseInt(e.target.value), installsRange[1]])}
                            inputProps={{ min: 0, max: installsRange[1] }}
                          />
                          <TextField
                            size="small"
                            label="Max Installs"
                            type="number"
                            value={installsRange[1]}
                            onChange={(e) => handleInstallsRangeChange(null, [installsRange[0], parseInt(e.target.value)])}
                            inputProps={{ min: installsRange[0], max: 5000000 }}
                          />
                        </Box>
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="caption">{formatInstallValueText(installsRange[0])}</Typography>
                        <Typography variant="caption">{formatInstallValueText(installsRange[1])}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            )}
          </Box>
        </Paper>

        {error && (
          <Paper sx={{ p: 3, mb: 4, bgcolor: 'error.50', borderRadius: 2 }}>
            <Typography color="error" align="center">
              {error}
            </Typography>
          </Paper>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30vh' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {filteredAndSortedPlugins.length > 0 ? (
              <>
                <Grid container spacing={3}>
                  {filteredAndSortedPlugins.map((plugin, index) => renderPluginCard(plugin, index))}
                </Grid>

                {!showFavoritesOnly && totalPlugins > DEFAULT_PER_PAGE && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                    <Pagination
                      count={Math.ceil(totalPlugins / (searchType === "author" ? AUTHOR_PER_PAGE : DEFAULT_PER_PAGE))}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                      showFirstButton
                      showLastButton
                      size="large"
                      disabled={loading || totalPlugins <= (searchType === "author" ? AUTHOR_PER_PAGE : DEFAULT_PER_PAGE)}
                    />
                  </Box>
                )}
              </>
            ) : (
              <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="body1" color="text.secondary">
                  {showFavoritesOnly
                    ? "No favorite plugins saved. Add plugins to your favorites to see them here."
                    : `No plugins found for the ${searchType} "${searchTerm}".`}
                </Typography>
              </Paper>
            )}
          </>
        )}

        <Box sx={{ mt: 4, mb: 2, textAlign: 'center' }}>
          <Chip
            label={`Total: ${totalPlugins} | Showing: ${filteredAndSortedPlugins.length}`}
            variant="outlined"
            color="primary"
          />
        </Box>
      </Container>

      {/* Plugin Detail Modal */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedPlugin && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h5">{selectedPlugin.name}</Typography>
                <IconButton onClick={() => setOpenModal(false)}>
                  ✕
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                  <img
                    src={selectedPlugin.icons?.["2x"] || selectedPlugin.icons?.["1x"] || selectedPlugin.icons?.default || "https://ps.w.org/classic-editor/assets/icon-256x256.png?rev=1998671"}
                    alt={selectedPlugin.name}
                    style={{ maxWidth: '100%', height: 'auto', maxHeight: '200px' }}
                  />
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" gutterBottom>Quick Stats</Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableBody>
                          <TableRow>
                            <TableCell>Version</TableCell>
                            <TableCell>{selectedPlugin.version}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>WordPress</TableCell>
                            <TableCell>Requires {selectedPlugin.requires || 'N/A'}, Tested with {selectedPlugin.tested || 'N/A'}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Active Installs</TableCell>
                            <TableCell>{formatActiveInstalls(selectedPlugin.active_installs)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Rating</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Rating value={selectedPlugin.rating ? selectedPlugin.rating / 100 * 5 : 0} readOnly precision={0.5} size="small" />
                                <Typography variant="body2" ml={1}>
                                  ({selectedPlugin.num_ratings})
                                </Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Last Updated</TableCell>
                            <TableCell>{calculateLastUpdated(selectedPlugin.last_updated)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Downloads</TableCell>
                            <TableCell>{selectedPlugin.downloaded?.toLocaleString() || 'N/A'}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Tabs value={0}>
                    <Tab label="Description" />
                  </Tabs>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" dangerouslySetInnerHTML={{ __html: selectedPlugin.sections?.description || 'No description available.' }} />
                  </Box>
                  {selectedPlugin.tags && Object.keys(selectedPlugin.tags).length > 0 && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle1" gutterBottom>Tags</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {Object.keys(selectedPlugin.tags).map(tag => (
                          <Chip key={tag} label={tag} size="small" />
                        ))}
                      </Box>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleAddToCompare(selectedPlugin)} color="primary">
                Add to Compare
              </Button>
              <Button
                href={`https://wordpress.org/plugins/${selectedPlugin.slug}`}
                target="_blank"
                variant="contained"
                color="primary"
              >
                View Plugin Page
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Comparison Drawer */}
      <Drawer
        anchor="right"
        open={showCompareDrawer}
        onClose={() => setShowCompareDrawer(false)}
        sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: '80%', md: '65%' } } }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">Compare Plugins</Typography>
            <Button onClick={handleClearCompare} color="error" variant="outlined">
              Clear All
            </Button>
          </Box>

          {compareList.length === 0 ? (
            <Typography>No plugins selected for comparison. Click "Compare" on any plugin card to add it here.</Typography>
          ) : (
            <>
              <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Feature</TableCell>
                      {compareList.map(plugin => (
                        <TableCell key={plugin.slug}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{plugin.name}</Typography>
                              <IconButton size="small" onClick={() => handleRemoveFromCompare(plugin.slug)}>
                                ✕
                              </IconButton>
                            </Box>
                            <img
                              src={plugin.icons?.["1x"] || plugin.icons?.default || "https://ps.w.org/classic-editor/assets/icon-128x128.png?rev=1998671"}
                              alt={plugin.name}
                              style={{ width: '64px', height: '64px', margin: '8px 0' }}
                            />
                          </Box>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Version</TableCell>
                      {compareList.map(plugin => (
                        <TableCell key={plugin.slug}>{plugin.version}</TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>Rating</TableCell>
                      {compareList.map(plugin => (
                        <TableCell key={plugin.slug}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            {plugin.rating ? (plugin.rating / 100 * 5).toFixed(1) : '0'}
                            <Typography variant="caption" color="text.secondary" ml={0.5}>
                              ({plugin.num_ratings})
                            </Typography>
                          </Box>
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>Active Installs</TableCell>
                      {compareList.map(plugin => (
                        <TableCell key={plugin.slug}>{formatActiveInstalls(plugin.active_installs)}</TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>Last Updated</TableCell>
                      {compareList.map(plugin => (
                        <TableCell key={plugin.slug}>{calculateLastUpdated(plugin.last_updated)}</TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>WordPress Compatibility</TableCell>
                      {compareList.map(plugin => (
                        <TableCell key={plugin.slug}>
                          {plugin.tested ? `Up to ${plugin.tested}` : 'N/A'}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell>Author</TableCell>
                      {compareList.map(plugin => (
                        <TableCell key={plugin.slug}>
                          {plugin.author_profile?.split("/").filter(Boolean).pop() || 'Unknown'}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                {compareList.map(plugin => (
                  <Button
                    key={plugin.slug}
                    variant="contained"
                    href={`https://wordpress.org/plugins/${plugin.slug}`}
                    target="_blank"
                  >
                    View {plugin.name}
                  </Button>
                ))}
              </Box>
            </>
          )}
        </Box>
      </Drawer>

      {/* Recently Viewed Drawer */}
      <Drawer
        anchor="left"
        open={showRecentlyViewed}
        onClose={() => setShowRecentlyViewed(false)}
        sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: '350px' } } }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Recently Viewed</Typography>
          {recentlyViewed.length === 0 ? (
            <Typography variant="body2">No plugins viewed yet</Typography>
          ) : (
            <List>
              {recentlyViewed.map(plugin => (
                <ListItem
                  key={plugin.slug}
                  button
                  onClick={() => {
                    handleViewPluginDetails(plugin);
                    setShowRecentlyViewed(false);
                  }}
                  divider
                >
                  <ListItemAvatar>
                    <Avatar
                      src={plugin.icons?.["1x"] || plugin.icons?.default || "https://ps.w.org/classic-editor/assets/icon-128x128.png?rev=1998671"}
                      alt={plugin.name}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={plugin.name}
                    secondary={`${formatActiveInstalls(plugin.active_installs)} active installs`}
                  />
                </ListItem>
              ))}
            </List>
          )}
          {recentlyViewed.length > 0 && (
            <Button
              variant="outlined"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => {
                setRecentlyViewed([]);
                setShowRecentlyViewed(false);
              }}
            >
              Clear History
            </Button>
          )}
        </Box>
      </Drawer>

      {/* Floating action buttons */}
      <Box sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 10 }}>
        <SpeedDial
          ariaLabel="Plugin options"
          icon="⚙️"
          direction="up"
        >
          <SpeedDialAction
            icon="📊"
            tooltipTitle="Analytics"
            onClick={() => setShowAnalytics(true)}
          />
          <SpeedDialAction
            icon="🔄"
            tooltipTitle="Compare Plugins"
            onClick={() => setShowCompareDrawer(true)}
            disabled={compareList.length === 0}
          />
          <SpeedDialAction
            icon="📋"
            tooltipTitle="Export CSV"
            onClick={handleExportCSV}
            disabled={filteredAndSortedPlugins.length === 0}
          />
          <SpeedDialAction
            icon="🕒"
            tooltipTitle="Recently Viewed"
            onClick={() => setShowRecentlyViewed(true)}
          />
        </SpeedDial>
      </Box>

      {/* Tag cloud for filtering */}
      {pluginTags.length > 0 && !showFavoritesOnly && (
        <Paper sx={{ p: 2, mb: 3, mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>Filter by Tags</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {pluginTags.map(({ tag, count }) => (
              <Chip
                key={tag}
                label={`${tag} (${count})`}
                onClick={() => handleTagToggle(tag)}
                color={selectedTags.includes(tag) ? "primary" : "default"}
                variant={selectedTags.includes(tag) ? "filled" : "outlined"}
                size="small"
              />
            ))}
          </Box>
          {selectedTags.length > 0 && (
            <Button
              variant="text"
              size="small"
              onClick={() => setSelectedTags([])}
              sx={{ mt: 1 }}
            >
              Clear All Tags
            </Button>
          )}
        </Paper>
      )}

      {/* Snackbar notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Analytics Modal */}
      <Dialog
        open={showAnalytics}
        onClose={() => setShowAnalytics(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5">Plugin Analytics Dashboard</Typography>
            <IconButton onClick={() => setShowAnalytics(false)}>
              ✕
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Analysis of {plugins.length} WordPress Plugins
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Insights and trends extracted from the current set of plugins.
            </Typography>
          </Box>

          <Tabs
            value={0}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Overview" />
            <Tab label="Tag Competition" onClick={() => setSelectedTagForAnalytics("")} />
            <Tab label="Search History" />
          </Tabs>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Distribution Analysis
                  </Typography>
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Chart Type</InputLabel>
                    <Select
                      value={analyticsType}
                      onChange={(e) => setAnalyticsType(e.target.value)}
                      label="Chart Type"
                    >
                      <MenuItem value="rating">Rating Distribution</MenuItem>
                      <MenuItem value="installs">Installation Tiers</MenuItem>
                      <MenuItem value="updates">Update Frequency</MenuItem>
                      <MenuItem value="versions">WordPress Compatibility</MenuItem>
                      <MenuItem value="tags">Top Tags</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                {renderAnalyticsChart()}
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Top Plugins by {
                      analyticsType === 'rating' ? 'Rating' :
                      analyticsType === 'installs' ? 'Active Installs' :
                      analyticsType === 'updates' ? 'Recent Updates' : 'Age'
                    }
                  </Typography>
                </Box>

                {analyticsType === 'tags' ? (
                  <Box>
                    <Typography variant="body2" gutterBottom>
                      Click on a tag to analyze plugins in that category:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                      {Object.entries(pluginsByCategory)
                        .sort((a, b) => b[1].length - a[1].length)
                        .slice(0, 20)
                        .map(([tag, plugins]) => (
                          <Chip
                            key={tag}
                            label={`${tag} (${plugins.length})`}
                            onClick={() => {
                              setSelectedTagForAnalytics(tag);
                              updateTagCompetitorData(tag);
                            }}
                            color={tag === selectedTagForAnalytics ? "primary" : "default"}
                            variant={tag === selectedTagForAnalytics ? "filled" : "outlined"}
                          />
                        ))
                      }
                    </Box>
                  </Box>
                ) : (
                  renderTopPlugins(
                    analyticsType === 'rating' ? 'rating' :
                    analyticsType === 'installs' ? 'installs' :
                    analyticsType === 'updates' ? 'recent' : 'age'
                  )
                )}
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                {selectedTagForAnalytics ? (
                  renderTagCompetitorAnalytics()
                ) : (
                  <>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Search History
                    </Typography>

                    {searchHistory.length > 0 ? (
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Search Term</TableCell>
                              <TableCell>Type</TableCell>
                              <TableCell>Date</TableCell>
                              <TableCell>Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {searchHistory.slice(0, 10).map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.term}</TableCell>
                                <TableCell>{item.type}</TableCell>
                                <TableCell>{new Date(item.date).toLocaleString()}</TableCell>
                                <TableCell>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => {
                                      setSearchType(item.type);
                                      setSearchTerm(item.term);
                                      setShowAnalytics(false);
                                    }}
                                  >
                                    Repeat Search
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Typography variant="body2">No search history available</Typography>
                    )}
                  </>
                )}
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          {selectedTagForAnalytics ? (
            <Button
              onClick={() => {
                const tagPluginsCSV = [
                  ['Rank', 'Name', 'Author', 'Active Installs', 'Rating', 'Last Updated', 'Version', 'WordPress Compatibility'].join(','),
                  ...tagCompetitorData.map((plugin, index) => [
                    index + 1,
                    `"${plugin.name.replace(/"/g, '""')}"`,
                    `"${plugin.author_profile?.split("/").filter(Boolean).pop() || 'Unknown'}"`,
                    plugin.active_installs,
                    plugin.rating ? (plugin.rating / 100 * 5).toFixed(1) : '0',
                    plugin.last_updated,
                    plugin.version,
                    plugin.tested || 'N/A'
                  ].join(','))
                ].join('\n');

                const blob = new Blob([tagPluginsCSV], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.setAttribute('href', url);
                link.setAttribute('download', `wp-plugins-${selectedTagForAnalytics}.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                setSnackbarMessage(`${selectedTagForAnalytics} plugins exported to CSV`);
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
              }}
              color="primary"
            >
              Export {selectedTagForAnalytics} Plugins
            </Button>
          ) : (
            <Button
              onClick={() => {
                const searchHistoryCSV = [
                  ['Search Term', 'Type', 'Date'].join(','),
                  ...searchHistory.map(item => [
                    `"${item.term}"`,
                    item.type,
                    new Date(item.date).toLocaleString()
                  ].join(','))
                ].join('\n');

                const blob = new Blob([searchHistoryCSV], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.setAttribute('href', url);
                link.setAttribute('download', 'wp-plugin-search-history.csv');
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              color="primary"
            >
              Export Search History
            </Button>
          )}
          <Button
            onClick={() => setShowAnalytics(false)}
            variant="contained"
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Growth Analytics Modal */}
      <Dialog
        open={showGrowthAnalytics}
        onClose={() => setShowGrowthAnalytics(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5">Plugin Growth Analytics</Typography>
            <IconButton onClick={() => setShowGrowthAnalytics(false)}>
              ✕
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Track and compare growth trends of WordPress plugins
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Time Period</InputLabel>
                  <Select
                    value={growthTimeframe}
                    onChange={(e) => handleTimeframeChange(e.target.value)}
                    label="Time Period"
                  >
                    <MenuItem value="7days">Last 7 Days</MenuItem>
                    <MenuItem value="15days">Last 15 Days</MenuItem>
                    <MenuItem value="1month">Last 30 Days</MenuItem>
                    <MenuItem value="3months">Last 3 Months</MenuItem>
                    <MenuItem value="6months">Last 6 Months</MenuItem>
                    <MenuItem value="1year">Last Year</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleGenerateDemoData}
                  startIcon="🔄"
                >
                  Generate Demo Data
                </Button>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex' }}>
            <Tabs
              orientation="vertical"
              value={showGrowthTrendChart ? 1 : 0}
              onChange={(e, newValue) => setShowGrowthTrendChart(newValue === 1)}
              sx={{ borderRight: 1, borderColor: 'divider', minWidth: 150 }}
            >
              <Tab label="Growth Comparison" />
              <Tab label="Trend Analysis" />
            </Tabs>

            <Box sx={{ flex: 1, pl: 2 }}>
              {showGrowthTrendChart ? (
                <Box>
                  <FormControl variant="outlined" size="small" sx={{ mb: 2, minWidth: 200 }}>
                    <InputLabel>Select Plugin</InputLabel>
                    <Select
                      value={selectedPluginForTrend || ''}
                      onChange={(e) => setSelectedPluginForTrend(e.target.value)}
                      label="Select Plugin"
                    >
                      <MenuItem value="">None</MenuItem>
                      {Object.keys(growthHistoryData)
                        .filter(slug => growthHistoryData[slug].dataPoints.length > 1)
                        .map(slug => (
                          <MenuItem key={slug} value={slug}>
                            {growthHistoryData[slug].name}
                          </MenuItem>
                        ))
                      }
                    </Select>
                  </FormControl>

                  {renderGrowthTrendChart()}
                </Box>
              ) : (
                renderGrowthCharts()
              )}
            </Box>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Note: Growth analytics data is based on recorded observations of plugin metrics over time.
              Use the "Generate Demo Data" button to create sample growth data for demonstration purposes.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              // Export growth data as CSV
              if (Object.keys(growthAnalyticsData).length > 0) {
                const headers = ['Plugin', 'Current Installs', 'Previous Installs', 'Growth Rate', 'Rating Growth', 'Review Growth', 'Period'];
                const csvContent = [
                  headers.join(','),
                  ...Object.keys(growthAnalyticsData).map(slug => {
                    const data = growthAnalyticsData[slug];
                    return [
                      `"${data.name.replace(/"/g, '""')}"`,
                      data.currentInstalls,
                      data.previousInstalls,
                      `${data.growthRate}%`,
                      `${data.ratingGrowth}%`,
                      `${data.reviewGrowth}%`,
                      data.timePeriod
                    ].join(',');
                  })
                ].join('\n');

                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.setAttribute('href', url);
                link.setAttribute('download', 'wp-plugin-growth-analytics.csv');
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                setSnackbarMessage("Growth data exported to CSV");
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
              }
            }}
            color="primary"
          >
            Export Growth Data
          </Button>
          <Button
            onClick={() => setShowGrowthAnalytics(false)}
            variant="contained"
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export default App;
