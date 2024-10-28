import React, { useEffect, useState } from "react";
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

function App() {
  const [plugins, setPlugins] = useState([]);
  // const [copied, setCopied] = useState({}); // Object to track copied state per plugin
  const [loading, setLoading] = useState(false);
  const [author, setAuthor] = useState("");
  const [inputAuthor, setInputAuthor] = useState("");
  const [totalPlugins, setTotalPlugins] = useState(0);

  const handleCopy = (text, slug) => {
      setAuthor(text);
  };

  useEffect(() => {
    fetchTotalPlugins();
    fetchPlugins(author);

  }, [author]);

  const fetchPlugins = (authorName) => {
    setLoading(true);
    const url = authorName
      ? `https://api.wordpress.org/plugins/info/1.2/?action=query_plugins&author=${authorName}&per_page=50`
      : `https://api.wordpress.org/plugins/info/1.2/?action=query_plugins&browse=new&per_page=30`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setPlugins(data.plugins || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching plugins:", error);
        setLoading(false);
      });
  };

  const fetchTotalPlugins = () => {
    fetch(
      `https://api.wordpress.org/plugins/info/1.2/?action=query_plugins&browse=new`
    )
      .then((response) => response.json())
      .then((data) => {
        setTotalPlugins(data.info.results);
      })
      .catch((error) => {
        console.error("Error fetching total plugins:", error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setAuthor(inputAuthor);
    //reset the value when resubmit same value
    setInputAuthor("");
  };

  const formatActiveInstalls = (activeInstalls) => {
    if (activeInstalls < 10) {
      // return `less than 10`;
      return `<10`;
    } else if (activeInstalls < 1000) {
      return `${activeInstalls}+`;
    } else if (activeInstalls < 1000000) {
      return `${(activeInstalls / 1000).toFixed(0)}k+`;
    } else {
      return `${(activeInstalls / 1000000).toFixed(0)}M+`;
    }
  };
const calculatePluginAge = (dateString) => {
  const createdDate = new Date(dateString);
  const currentDate = new Date();

  // Check if the difference is less than 24 hours
  const diffInMilliseconds = currentDate - createdDate;
  const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
  if (diffInHours < 24) return "newbie";

  let years = currentDate.getFullYear() - createdDate.getFullYear();
  let months = currentDate.getMonth() - createdDate.getMonth();
  let days = currentDate.getDate() - createdDate.getDate();

  // Adjust for negative days and months
  if (days < 0) {
    months -= 1;
    days += new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    ).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const pluralize = (value, unit) =>
    value > 1 ? `${value} ${unit}s` : `${value} ${unit}`;

  let ageParts = [];
  if (years > 0) ageParts.push(pluralize(years, "year"));
  if (months > 0) ageParts.push(pluralize(months, "month"));
  if (days > 0) ageParts.push(pluralize(days, "day"));

  return ageParts.join(", ");
};


  const calculateLastUpdated = (dateString) => {

    // Normalize the date string by removing "GMT" and adding space before AM/PM if present
    // dateString + 6hr;
    const normalizedDateString = dateString
      .replace(/(am|pm)/i, " $1") // Ensure AM/PM is correctly formatted
      .replace("GMT", ""); // Remove GMT

    // Parse the date string into a Date object
    let updatedDate = new Date(normalizedDateString);
    updatedDate.setHours(updatedDate.getHours() + 6);
    const currentDate = new Date();

    // Check if the date is valid
    if (isNaN(updatedDate)) {
      return "Invalid date";
    }

    // Calculate differences
    let years = currentDate.getFullYear() - updatedDate.getFullYear();
    let months = currentDate.getMonth() - updatedDate.getMonth();
    let days = currentDate.getDate() - updatedDate.getDate();
    let hours = currentDate.getHours() - updatedDate.getHours();
    let minutes = currentDate.getMinutes() - updatedDate.getMinutes();

    // Adjust for negative values in minutes, hours, days, and months
    if (minutes < 0) {
      minutes += 60;
      hours--;
    }
    if (hours < 0) {
      hours += 24;
      days--;
    }
    if (days < 0) {
      const lastMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        0
      );
      days += lastMonth.getDate(); // Get the last day of the previous month
      months--;
    }
    if (months < 0) {
      months += 12;
      years--;
    }

    // Prepare the time difference output
    const parts = [];
    if (years > 0) {
      parts.push(`${years}yr${years > 1 ? "s" : ""}`);
    }
    if (months > 0) {
      parts.push(`${months}month${months > 1 ? "s" : ""}`);
    }
    if (days > 0) {
      parts.push(`${days}day${days > 1 ? "s" : ""}`);
    }
    if (hours > 0) {
      parts.push(`${hours}hr${hours > 1 ? "s" : ""}`);
    }
    if (minutes > 0) {
      parts.push(`${minutes}min${minutes > 1 ? "s" : ""}`);
    }

    const timeDifference =
      parts.length > 0 ? parts.join(" ") + " ago" : "Just now";

    // Format the updated date to show the exact time
    const options = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: "Asia/Dhaka",
    };
    const formattedTime = updatedDate.toLocaleString("en-US", options); //bangladesh local time
    //bangladesh local time will be

    // Combine both time difference and formatted time
    return `${timeDifference} at ${formattedTime.replace(" ", "")}`;
  };

  // Example usages
  console.log(calculateLastUpdated("2024-02-19 3:14pm GMT")); // Output will depend on the current date
  console.log(calculateLastUpdated("2023-04-28")); // Output will depend on the current date

  // Example usage
  const lastUpdatedString = calculateLastUpdated("2024-02-19 3:14pm GMT");
  console.log(lastUpdatedString); // Output will depend on the current date/time

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
        Displaying plugins by author. Enter the author name to search for
        plugins.
      </Typography>

      {/* Author Input Form */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        style={{ marginBottom: "80px", textAlign: "center" }}
      >
        <TextField
          // label="Author Name"
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

      {/* Show Loading Spinner */}
      {loading && (
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
      )}

      {/* Plugins Grid */}
      {!loading && plugins.length > 0 && (
        <Grid container spacing={4}>
          {plugins
            .sort((a, b) => b.active_installs - a.active_installs)
            .map((plugin, index) => {
              const localRank =
                plugins
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
                        onClick={() => handleCopy(username, plugin.slug)}
                      >
                        {`Age: `}
                        {calculatePluginAge(plugin.added)}
                      </Typography>
                      {!author && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleCopy(username, plugin.slug)}
                        >
                          {`Author: ${username}`}
                        </Typography>
                      )}
{plugin.active_installs >= 10 &&
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
                        {`${formatActiveInstalls(
                          plugin.active_installs
                        )}`}
                      </Typography>
            }
                      {author && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          onClick={() => handleCopy(username, plugin.slug)}
                          style={{
                            marginBottom: "15px",
                          }}
                        >
                          {`Updated: `}
                          {calculateLastUpdated(plugin.last_updated)}
                        </Typography>
                      )}
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

                      <Typography variant="h5" component="div">
                        {plugin.name
                          .replace(/&#8211;/g, "-")
                          .replace(/&amp;/g, "&")}
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
            })}
        </Grid>
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

      {!loading && plugins.length === 0 && (
        <Typography variant="body1" align="center" color="text.secondary">
          No plugins found for the author "{author}".
        </Typography>
      )}
    </Container>
  );
}

export default App;
