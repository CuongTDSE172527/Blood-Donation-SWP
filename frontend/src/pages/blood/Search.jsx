import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  MenuItem,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';

const Search = () => {
  const [searchParams, setSearchParams] = useState({
    bloodType: '',
    location: '',
    distance: '10',
  });

  const [searchResults, setSearchResults] = useState([
    {
      id: 1,
      bloodType: 'A+',
      units: 5,
      hospital: 'City General Hospital',
      distance: '2.5 km',
      lastUpdated: '2024-02-20',
    },
    {
      id: 2,
      bloodType: 'O+',
      units: 3,
      hospital: 'Community Medical Center',
      distance: '5.8 km',
      lastUpdated: '2024-02-19',
    },
  ]);

  const handleChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Implement blood search
    console.log('Search params:', searchParams);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Search Blood Availability
        </Typography>
        
        {/* Search Form */}
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Box component="form" onSubmit={handleSearch}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  required
                  fullWidth
                  select
                  label="Blood Type"
                  name="bloodType"
                  value={searchParams.bloodType}
                  onChange={handleChange}
                >
                  <MenuItem value="A+">A+</MenuItem>
                  <MenuItem value="A-">A-</MenuItem>
                  <MenuItem value="B+">B+</MenuItem>
                  <MenuItem value="B-">B-</MenuItem>
                  <MenuItem value="AB+">AB+</MenuItem>
                  <MenuItem value="AB-">AB-</MenuItem>
                  <MenuItem value="O+">O+</MenuItem>
                  <MenuItem value="O-">O-</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={searchParams.location}
                  onChange={handleChange}
                  placeholder="Enter city or zip code"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  select
                  label="Distance (km)"
                  name="distance"
                  value={searchParams.distance}
                  onChange={handleChange}
                >
                  <MenuItem value="5">5 km</MenuItem>
                  <MenuItem value="10">10 km</MenuItem>
                  <MenuItem value="20">20 km</MenuItem>
                  <MenuItem value="50">50 km</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Search Results */}
        <Typography variant="h5" gutterBottom>
          Available Blood Units
        </Typography>
        <Grid container spacing={3}>
          {searchResults.map((result) => (
            <Grid item xs={12} md={6} key={result.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {result.bloodType} - {result.units} Units Available
                  </Typography>
                  <Typography color="text.secondary" gutterBottom>
                    {result.hospital}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Distance: {result.distance}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Last Updated: {result.lastUpdated}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    Contact Hospital
                  </Button>
                  <Button size="small" color="primary">
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Search; 