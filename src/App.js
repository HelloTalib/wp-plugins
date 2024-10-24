import React, { useEffect, useState } from 'react';
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
} from '@mui/material';

function App() {
  const [plugins, setPlugins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [author, setAuthor] = useState('wpxero'); // Default author value
  const [inputAuthor, setInputAuthor] = useState('wpxero'); // Controlled input

  useEffect(() => {
    fetchPlugins(author);
  }, [author]);

  const fetchPlugins = (authorName) => {
    setLoading(true);
    fetch(`https://api.wordpress.org/plugins/info/1.2/?action=query_plugins&author=${authorName}`)
      .then((response) => response.json())
      .then((data) => {
        setPlugins(data.plugins || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching plugins:', error);
        setLoading(false);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setAuthor(inputAuthor); // Update the author to fetch data
  };

  return (
    <Container style={{ paddingTop: '20px', paddingBottom: '20px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        WordPress Plugins by Author
      </Typography>

      {/* Author Input Form */}
      <Box component="form" onSubmit={handleSubmit} style={{ marginBottom: '20px', textAlign: 'center' }}>
        <TextField
          label="Author Name"
          variant="outlined"
          value={inputAuthor}
          onChange={(e) => setInputAuthor(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <Button type="submit" variant="contained" color="primary">
          Search
        </Button>
      </Box>

      {/* Show Loading Spinner */}
      {loading && (
        <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20vh' }}>
          <CircularProgress />
        </Box>
      )}

      {/* Plugins Grid */}
      {!loading && plugins.length > 0 && (
        <Grid container spacing={4}>
          {plugins.sort((a, b) => b.active_installs - a.active_installs) // Sorting in ascending order by active installs
            .map((plugin) => (

            <Grid item key={plugin.slug} xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  // height="200"
                  style={{
                    objectFit: 'cover',
                    height: '150px',
                    width: 'auto',
                    margin: '0 auto',

                   }}
                    image={plugin.icons ? plugin.icons['2x'] || plugin.icons['1x'] || plugin.icons.default : 'https://via.placeholder.com/300'}
                  alt={plugin.name}
                />
                <CardContent>
                  {/* //active install */}
                   <Typography variant="body2" color="text.secondary" style={{ marginBottom: '15px' }}>
                    Active Installs: {plugin.active_installs < 10 ? '<10' : plugin.active_installs + '+'}
                  </Typography>
                  <Typography variant="h5" component="div">
                    {/* {plugin.name} */}
                    {/* // make esc_html also skip it &#8211; &amp; */}
                    {plugin.name.replace(/&#8211;/g, '-').replace(/&amp;/g, '&')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" style={{ marginBottom: '15px' }}>
                    {plugin.short_description}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    href={plugin.homepage}
                    target="_blank"
                    fullWidth
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Show Message if No Plugins Found */}
      {!loading && plugins.length === 0 && (
        <Typography variant="body1" align="center" color="text.secondary">
          No plugins found for the author "{author}".
        </Typography>
      )}
    </Container>
  );
}

export default App;
