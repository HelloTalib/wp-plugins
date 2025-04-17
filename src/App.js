import React, { useEffect, useState, useCallback } from "react";
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
} from "@mui/material";

// Constants
const API_BASE_URL = 'https://api.wordpress.org/plugins/info/1.2/';
const DEFAULT_PER_PAGE = 30;
const AUTHOR_PER_PAGE = 50;

function App() {
  const [plugins, setPlugins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [author, setAuthor] = useState("");
  const [inputAuthor, setInputAuthor] = useState("");
  const [totalPlugins, setTotalPlugins] = useState(0);
  const [error, setError] = useState(null);

  // Memoized API call functions
  const fetchPlugins = useCallback(async (authorName) => {
    setLoading(true);
    setError(null);
    try {
      const url = authorName
        ? `${API_BASE_URL}?action=query_plugins&author=${authorName}&per_page=${AUTHOR_PER_PAGE}`
        : `${API_BASE_URL}?action=query_plugins&browse=new&per_page=${DEFAULT_PER_PAGE}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch plugins');

      const data = await response.json();
      setPlugins(data.plugins || []);
    } catch (error) {
      console.error("Error fetching plugins:", error);
      setError("Failed to load plugins. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTotalPlugins = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}?action=query_plugins&browse=new`);
      if (!response.ok) throw new Error('Failed to fetch total plugins');

      const data = await response.json();
      setTotalPlugins(data.info.results);
    } catch (error) {
      console.error("Error fetching total plugins:", error);
      setError("Failed to load total plugins count.");
    }
  }, []);

  // Effect for initial data loading
  useEffect(() => {
    fetchTotalPlugins();
    fetchPlugins(author);
  }, [author, fetchPlugins, fetchTotalPlugins]);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    setAuthor(inputAuthor);
    setInputAuthor("");
  }, [inputAuthor]);

  const handleCopy = useCallback((text) => {
    setAuthor(text);
  }, []);

  // Memoized utility functions
  const formatActiveInstalls = useCallback((activeInstalls) => {
    if (activeInstalls < 10) return `<10`;
    if (activeInstalls < 1000) return `${activeInstalls}+`;
    if (activeInstalls < 1000000) return `${(activeInstalls / 1000).toFixed(0)}k+`;
    return `${(activeInstalls / 1000000).toFixed(0)}M+`;
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
    const localRank = plugins
      .sort((a, b) => b.active_installs - a.active_installs)
      .indexOf(plugin) + 1;
    const username = plugin.author_profile
      ? plugin.author_profile.split("/").filter(Boolean).pop()
      : "Unknown";

    return (
      <Grid item key={plugin.slug} xs={12} sm={6} md={4}>
        <Card style={{ position: "relative" }}>
          <a
            href={`https://wordpress.org/plugins/${plugin.slug}/advanced`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <CardMedia
              component="img"
              style={{
                objectFit: "cover",
                height: "150px",
                width: "auto",
                margin: "0 auto",
              }}
              image={
                plugin.icons
                  ? plugin.icons["2x"] ||
                    plugin.icons["1x"] ||
                    plugin.icons.default
                  : "https://via.placeholder.com/300"
              }
              alt={plugin.name}
              href={`https://wordpress.org/plugins/${plugin.slug}`}
            />
          </a>
          <CardContent>
            <Typography
              variant="body2"
              color="text.secondary"
              onClick={() => handleCopy(username)}
            >
              {`Age: `}
              {calculatePluginAge(plugin.added)}
            </Typography>
            {!author && (
              <Typography
                variant="body2"
                color="text.secondary"
                style={{ cursor: "pointer" }}
                onClick={() => handleCopy(username)}
              >
                {`Author: ${username}`}
              </Typography>
            )}
            {plugin.active_installs >= 10 && (
              <a
                href={`https://plugintests.com/plugins/wporg/${plugin.slug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    color: "rgb(51, 51, 51)",
                    padding: "20px 0px 4px 0",
                    fontWeight: "bold",
                    transform: "rotate(45deg) translate(18px, -33px)",
                    textAlign: "center",
                    width: "93px",
                    backgroundColor:
                      plugin.active_installs < 1000
                        ? "#ffcccb"
                        : plugin.active_installs < 10000
                        ? "#fff68f"
                        : "#98fb98",
                  }}
                >
                  {`${formatActiveInstalls(plugin.active_installs)}`}
                </Typography>
              </a>
            )}
            {author && (
              <Typography
                variant="body2"
                color="text.secondary"
                onClick={() => handleCopy(username)}
                style={{
                  marginBottom: "15px",
                }}
              >
                {`Updated: `}
                {calculateLastUpdated(plugin.last_updated)}
              </Typography>
            )}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://wp-rankings.com/plugins/${plugin.slug}/`}
            >
              <Typography
                variant="body2"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  color: "rgba(0, 0, 0, 0.23)",
                  padding: "20px 0px 4px 0",
                  fontWeight: "bold",
                  transform: "rotate(-45deg) translate(-18px, -38px)",
                  textAlign: "center",
                  width: "93px",
                  backgroundColor: "rgb(240 240 247)",
                }}
              >
                {localRank < 10 ? `0${localRank}` : localRank}
              </Typography>
            </a>
            <Typography variant="h5" component="div">
              {plugin.name.replace(/&#8211;/g, "-").replace(/&amp;/g, "&")}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              style={{ marginBottom: "15px" }}
            >
              {plugin.short_description}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              href={`https://wordpress.org/plugins/${plugin.slug}`}
              target="_blank"
              fullWidth
            >
              View Plugin Page
            </Button>
          </CardContent>
        </Card>
      </Grid>
    );
  }, [author, calculatePluginAge, calculateLastUpdated, formatActiveInstalls, handleCopy, plugins]);

  return (
    <Container style={{ paddingTop: "20px", paddingBottom: "20px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        {`WordPress Plugins by ${author || "New"}`}
      </Typography>
      <Typography
        variant="body1"
        align="center"
        color="text.secondary"
        style={{ marginBottom: "20px" }}
      >
        Displaying plugins by author. Enter the author name to search for plugins.
      </Typography>

      {error && (
        <Typography color="error" align="center" style={{ marginBottom: "20px" }}>
          {error}
        </Typography>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        style={{ marginBottom: "80px", textAlign: "center" }}
      >
        <TextField
          variant="outlined"
          value={inputAuthor}
          onChange={(e) => setInputAuthor(e.target.value)}
          style={{ marginRight: "10px" }}
          label={`${!author ? "Author Name" : "Browse New"}`}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ padding: "15px 20px" }}
        >
          Search
        </Button>
      </Box>

      {loading ? (
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "20vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          {plugins.length > 0 && (
            <Grid container spacing={4}>
              {plugins
                .sort((a, b) => b.active_installs - a.active_installs)
                .map((plugin, index) => renderPluginCard(plugin, index))}
            </Grid>
          )}
          {!loading && plugins.length === 0 && (
            <Typography variant="body1" align="center" color="text.secondary">
              No plugins found for the author "{author}".
            </Typography>
          )}
        </>
      )}

      <div style={{ height: "50px" }}>
        <Typography
          variant="body2"
          color="text.secondary"
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            marginBottom: "15px",
          }}
        >
          {`Total Plugins: ${totalPlugins}`}
        </Typography>
      </div>
    </Container>
  );
}

export default App;
