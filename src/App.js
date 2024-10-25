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
  const [author, setAuthor] = useState(''); // Default author value
  const [inputAuthor, setInputAuthor] = useState(''); // Controlled input
  const [totalPlugins, setTotalPlugins] = useState(0);
  // const [allPlugins, setAllPlugins] = useState([]); // To storess all plugins for global ranking

  useEffect(() => {
    fetchTotalPlugins(); // Fetch total plugins for the current author
    fetchPlugins(author); // Fetch plugins for the current author
  }, [author]);

  const fetchPlugins = (authorName) => {
    setLoading(true);
    fetch(`https://api.wordpress.org/plugins/info/1.2/?action=query_plugins&author=${authorName}&per_page=50`)
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
  const fetchTotalPlugins = () => {
    fetch(`https://api.wordpress.org/plugins/info/1.2/?action=query_plugins&per_page=-1`)
      .then((response) => response.json())
      .then((data) => {
        setTotalPlugins(data.info.results);
        // setAllPlugins(data.plugins || []); // Store all plugins for global ranking
      })
      .catch((error) => {
        console.error('Error fetching total plugins:', error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setAuthor(inputAuthor); // Update the author to fetch data
  };

  const formatActiveInstalls = (activeInstalls) => {
    if (activeInstalls < 10) {
      return `less than 10`;
    } else if (activeInstalls < 1000) {
      return `${activeInstalls}+`;
    } else if (activeInstalls < 1000000) {
      return `${(activeInstalls / 1000).toFixed(0)}k+`;
    } else {
      return `${(activeInstalls / 1000000).toFixed(0)}M+`;
    }
  };

  // const getBadge = (activeInstalls) => {
  //   if (activeInstalls < 100) {
  //     return 'Low';
  //   } else if (activeInstalls < 1000) {
  //     return 'Medium';
  //   } else if (activeInstalls < 10000) {
  //     return 'High';
  //   } else {
  //     return 'Top';
  //   }
  // };

  return (
    <Container style={{ paddingTop: '20px', paddingBottom: '20px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        WordPress Plugins by Author
      </Typography>

      <Typography variant="body1" align="center" color="text.secondary" style={{ marginBottom: '20px' }}>
        Displaying plugins by author. Enter the author name to search for plugins.
      </Typography>


      {/* Author Input Form */}
      <Box component="form" onSubmit={handleSubmit} style={{ marginBottom: '80px', textAlign: 'center' }}>
        <TextField
          label="Author Name"
          variant="outlined"
          value={inputAuthor}
          onChange={(e) => setInputAuthor(e.target.value)}
          style={{ marginRight: '10px' }}
          placeholder='Enter author name'
        />
        <Button type="submit" variant="contained" color="primary" style={{
          padding: '15px 20px',
        }}>
          Search
        </Button>
        <Typography variant="body2" color="text.secondary" style={{ marginTop: '10px' }}>

        </Typography>
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
          {plugins
            .sort((a, b) => b.active_installs - a.active_installs) // Sorting in descending order by active installs
            .map((plugin, index) => {
              // Calculate local ranking among author's plugins
              const localRank = plugins.sort((a, b) => b.active_installs - a.active_installs).indexOf(plugin) + 1;

              // Calculate global ranking among all plugins
              // const globalRank = allPlugins.sort((a, b) => b.active_installs - a.active_installs).indexOf(plugin) + 1;

              return (
                <Grid item key={plugin.slug} xs={12} sm={6} md={4} >
                  <Card style={{
                    position: 'relative',
                  }}>
                    <CardMedia
                      component="img"
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
                      {/* Display active installs */}
                      <Typography variant="body2" color="text.secondary" style={{ marginBottom: '15px' }}>
                        {`Active Installs: ${formatActiveInstalls(plugin.active_installs)}`}
                      </Typography>

                      {/* Display Badge */}
                      <Typography
                        variant="body2"
                        style={{
                          display: 'inline-block',
                          // padding: '4px 8px',
                          borderRadius: '50%',
                          backgroundColor: plugin.active_installs < 1000 ? '#ffcccb' : plugin.active_installs < 10000 ? '#fff68f' : '#98fb98',
                          color: '#333',
                          fontWeight: 'bold',
                          // marginBottom: '10px',
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          width: '28px',
                          height: '28px',
                          textAlign: 'center',
                          lineHeight: '28px',

                        }}
                      >
                        {/* {localRank}
                        make 2digit number */}
                        {/* {localRank} */}
                         {localRank < 10 ? `0${localRank}` : localRank}
                        {/* {getBadge(localRank)} */}
                      </Typography>

                      {/* Display Local and Global Ranking Index */}
                      {/* <Typography variant="body2" color="text.secondary" style={{ marginBottom: '15px' }}>
                        {`Local Ranking: ${localRank} out of ${plugins.length} | Global Ranking: ${globalRank} out of ${totalPlugins}`}
                      </Typography> */}

                      <Typography variant="h5" component="div">
                        {plugin.name.replace(/&#8211;/g, '-').replace(/&amp;/g, '&')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" style={{ marginBottom: '15px' }}>
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

      <div style={{ height: '50px' }}>
        {/* total plugins */}
        <Typography variant="body2" color="text.secondary" style={{
        position:"fixed",
        bottom: "20px",
        right: "20px",
           marginBottom: '15px' }}>
          {`Total Plugins: ${totalPlugins}`}
        </Typography>
      </div>

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
