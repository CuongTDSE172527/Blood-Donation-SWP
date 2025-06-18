import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Event as EventIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Group as GroupIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';

const sectionBg = '#fff5f5';
const cardShadow = '0 4px 24px 0 rgba(211,47,47,0.07)';
const cardRadius = 3;

function Events() {
  const { t } = useTranslation();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Mock data for events
  const events = [
    {
      id: 1,
      title: 'Blood Donation Drive - Spring 2024',
      date: '2024-03-15',
      time: '09:00 - 17:00',
      location: 'Central Hospital, District 1',
      image: 'https://source.unsplash.com/random/800x600/?blood-donation',
      description: 'Join us for our annual spring blood donation drive. Your contribution can save lives!',
      spots: 50,
      registered: 25,
    },
    {
      id: 2,
      title: 'Emergency Blood Drive',
      date: '2024-03-20',
      time: '08:00 - 20:00',
      location: 'City Medical Center, District 3',
      image: 'https://source.unsplash.com/random/800x600/?hospital',
      description: 'Urgent need for blood donations. All blood types welcome.',
      spots: 100,
      registered: 75,
    },
    {
      id: 3,
      title: 'Community Blood Drive',
      date: '2024-03-25',
      time: '10:00 - 18:00',
      location: 'Community Center, District 7',
      image: 'https://source.unsplash.com/random/800x600/?community',
      description: 'A community event to support local hospitals and patients in need.',
      spots: 75,
      registered: 30,
    },
  ];

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement form submission logic
    setSnackbar({
      open: true,
      message: t('events.successMessage'),
      severity: 'success',
    });
    handleCloseDialog();
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ bgcolor: sectionBg, minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          align="center"
          fontWeight={700}
          sx={{ mb: 5, textDecoration: 'underline', textUnderlineOffset: 8, color: '#d32f2f', letterSpacing: -1 }}
        >
          {t('events.title')}
        </Typography>

        <Grid container spacing={4}>
          {events.map((event) => (
            <Grid item xs={12} md={4} key={event.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: cardRadius,
                  boxShadow: cardShadow,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={event.image}
                  alt={event.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" gutterBottom sx={{ color: '#d32f2f', fontWeight: 600 }}>
                    {event.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarIcon sx={{ color: 'text.secondary', mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {event.date}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <TimeIcon sx={{ color: 'text.secondary', mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {event.time}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationIcon sx={{ color: 'text.secondary', mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {event.location}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {event.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <GroupIcon sx={{ color: 'text.secondary', mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {event.registered}/{event.spots} {t('events.spots')}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleEventClick(event)}
                    sx={{
                      bgcolor: '#d32f2f',
                      '&:hover': {
                        bgcolor: '#b71c1c',
                      },
                    }}
                  >
                    {t('events.register')}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Registration Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EventIcon sx={{ color: '#d32f2f', mr: 1 }} />
            {t('events.registerTitle')}
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                {selectedEvent.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CalendarIcon sx={{ color: 'text.secondary', mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  {selectedEvent.date} {selectedEvent.time}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationIcon sx={{ color: 'text.secondary', mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  {selectedEvent.location}
                </Typography>
              </Box>
            </Box>
          )}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              required
              fullWidth
              label={t('events.name')}
              name="name"
              value={formData.name}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              required
              fullWidth
              label={t('events.email')}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              required
              fullWidth
              label={t('events.phone')}
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t('events.cancel')}</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              bgcolor: '#d32f2f',
              '&:hover': {
                bgcolor: '#b71c1c',
              },
            }}
          >
            {t('events.submit')}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Events; 