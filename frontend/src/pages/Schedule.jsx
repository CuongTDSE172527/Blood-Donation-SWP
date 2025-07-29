import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import { 
  LocalHospital, 
  LocationOn, 
  Schedule as ScheduleIcon,
  AccessTime,
  CalendarToday,
  Person,
  Phone,
  Email
} from '@mui/icons-material';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { scheduleService } from '../services/scheduleService';
import { useAuth } from '../hooks/useAuth';

const sectionBg = '#fff5f5';
const cardShadow = '0 4px 24px 0 rgba(211,47,47,0.07)';

const Schedule = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState([null, null]);
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  // Load all schedules on component mount
  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      setLoading(true);
      const data = await scheduleService.getAllSchedules();
      console.log('Loaded schedules:', data);
      setSchedules(data);
    } catch (err) {
      console.error('Error loading schedules:', err);
      setError(err.message || 'Failed to load schedules');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setSearched(true);
    if (dateRange[0] && dateRange[1]) {
      const start = dayjs(dateRange[0]);
      const end = dayjs(dateRange[1]);
      const filtered = schedules.filter(schedule => {
        try {
          const scheduleDate = dayjs(schedule.date);
          if (!scheduleDate.isValid()) return false;
          
          // Compare dates using unix timestamps
          const scheduleUnix = scheduleDate.startOf('day').unix();
          const startUnix = start.subtract(1, 'day').startOf('day').unix();
          const endUnix = end.add(1, 'day').startOf('day').unix();
          
          return scheduleUnix >= startUnix && scheduleUnix <= endUnix;
        } catch (error) {
          console.error('Error filtering schedule:', error, schedule);
          return false;
        }
      });
      setFilteredSchedules(filtered);
    } else {
      setFilteredSchedules(schedules);
    }
  };

  const handleScheduleClick = (schedule) => {
    // Check if schedule has valid date
    if (!schedule || !schedule.date) {
      setError('Lịch hiến máu không hợp lệ');
      return;
    }

    try {
      const scheduleDate = dayjs(schedule.date);
      if (!scheduleDate.isValid()) {
        setError('Lịch hiến máu không hợp lệ');
        return;
      }

      const today = dayjs();
      
      // Compare dates using unix timestamps
      const scheduleUnix = scheduleDate.startOf('day').unix();
      const todayUnix = today.startOf('day').unix();
      
      if (scheduleUnix < todayUnix) {
        setError('Không thể đăng ký cho lịch hiến máu đã qua');
        return;
      }

      // Check if user is logged in
      if (!user) {
        setError('Vui lòng đăng nhập để đăng ký hiến máu');
        return;
      }

      // Navigate to donation registration with schedule data
      navigate('/donation-registration', { 
        state: { 
          selectedSchedule: schedule,
          fromSchedule: true 
        } 
      });
    } catch (error) {
      console.error('Error in handleScheduleClick:', error, schedule);
      setError('Lịch hiến máu không hợp lệ');
    }
  };

  const formatTime = (time) => {
    if (!time) return 'N/A';
    try {
      return dayjs(`2000-01-01T${time}`).format('HH:mm');
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Invalid Time';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return dayjs(date).format('DD/MM/YYYY');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const getStatusColor = (schedule) => {
    if (!schedule || !schedule.date) return 'default';
    
    try {
      const scheduleDate = dayjs(schedule.date);
      if (!scheduleDate.isValid()) return 'default';
      
      const today = dayjs();
      
      // Compare dates using unix timestamps
      const scheduleUnix = scheduleDate.startOf('day').unix();
      const todayUnix = today.startOf('day').unix();
      
      if (scheduleUnix < todayUnix) {
        return 'default'; // Past
      } else if (scheduleUnix === todayUnix) {
        return 'success'; // Today
      } else {
        return 'primary'; // Future
      }
    } catch (error) {
      console.error('Error in getStatusColor:', error, schedule);
      return 'default';
    }
  };

  const getStatusText = (schedule) => {
    if (!schedule || !schedule.date) return 'Unknown';
    
    try {
      const scheduleDate = dayjs(schedule.date);
      if (!scheduleDate.isValid()) return 'Unknown';
      
      const today = dayjs();
      
      // Compare dates using unix timestamps
      const scheduleUnix = scheduleDate.startOf('day').unix();
      const todayUnix = today.startOf('day').unix();
      
      if (scheduleUnix < todayUnix) {
        return t('schedule.past') || 'Past';
      } else if (scheduleUnix === todayUnix) {
        return t('schedule.today') || 'Today';
      } else {
        return t('schedule.upcoming') || 'Upcoming';
      }
    } catch (error) {
      console.error('Error in getStatusText:', error, schedule);
      return 'Unknown';
    }
  };

  const isScheduleClickable = (schedule) => {
    if (!schedule || !schedule.date) return false;
    
    try {
      const scheduleDate = dayjs(schedule.date);
      console.log('scheduleDate object:', scheduleDate);
      
      if (!scheduleDate.isValid()) return false;
      
      const today = dayjs();
      // Compare dates using unix timestamps
      const scheduleUnix = scheduleDate.startOf('day').unix();
      const todayUnix = today.startOf('day').unix();
      const result = scheduleUnix >= todayUnix;
      
      console.log('isScheduleClickable result:', result);
      return result;
    } catch (error) {
      console.error('Error in isScheduleClickable:', error, schedule);
      return false;
    }
  };

  return (
    <Box sx={{ bgcolor: sectionBg, minHeight: '100vh', py: 8 }}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ bgcolor: '#fff', borderRadius: 4, p: { xs: 4, md: 6 }, boxShadow: cardShadow }}>
          <Typography variant="h4" fontWeight={700} align="center" sx={{ color: '#d32f2f', mb: 3, letterSpacing: -0.5 }}>
            <LocalHospital sx={{ mr: 1, verticalAlign: 'middle', color: '#d32f2f' }} />
            {t('schedule.title')}
          </Typography>
          <Typography variant="subtitle1" align="center" sx={{ mb: 2, fontWeight: 500, color: 'text.secondary' }}>
            {t('schedule.selectTime')}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              localeText={{ start: t('schedule.fromDate'), end: t('schedule.toDate') }}
              sx={{ width: '100%', mb: 2 }}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                px: 6, py: 1.5, fontWeight: 700, borderRadius: 3, fontSize: 18,
                background: 'linear-gradient(90deg, #d32f2f 60%, #ff7961 100%)',
                color: '#fff',
                boxShadow: '0 2px 8px 0 rgba(211,47,47,0.15)',
                transition: 'transform 0.15s',
                '&:hover': { background: 'linear-gradient(90deg, #b71c1c 60%, #ff7961 100%)', transform: 'scale(1.04)' }
              }}
              onClick={handleSearch}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : t('schedule.search')}
            </Button>
          </Box>

          {searched && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#d32f2f' }}>
                {t('schedule.availableDates')} ({filteredSchedules.length} {t('schedule.bloodDonationSchedules')})
              </Typography>
              
              {filteredSchedules.length > 0 ? (
                <Grid container spacing={3}>
                  {filteredSchedules.map(schedule => (
                    <Grid item xs={12} md={6} lg={4} key={schedule.id}>
                      <Card 
                        sx={{ 
                          cursor: isScheduleClickable(schedule) ? 'pointer' : 'not-allowed',
                          transition: 'all 0.3s ease',
                          opacity: isScheduleClickable(schedule) ? 1 : 0.6,
                          '&:hover': isScheduleClickable(schedule) ? { 
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 32px 0 rgba(211,47,47,0.15)'
                          } : {}
                        }}
                        onClick={() => handleScheduleClick(schedule)}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <CalendarToday sx={{ color: '#d32f2f', mr: 1 }} />
                            <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 600 }}>
                              {formatDate(schedule.date)}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <AccessTime sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {formatTime(schedule.time)}
                            </Typography>
                          </Box>

                          {schedule.location && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <LocationOn sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                              <Typography variant="body2" color="text.secondary">
                                {schedule.location.name}
                              </Typography>
                            </Box>
                          )}

                          {schedule.location && schedule.location.address && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {schedule.location.address}
                            </Typography>
                          )}

                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Chip 
                              label={getStatusText(schedule)}
                              color={getStatusColor(schedule)}
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                            {isScheduleClickable(schedule) && (
                              <Button
                                variant="contained"
                                size="small"
                                sx={{ 
                                  bgcolor: '#d32f2f',
                                  '&:hover': { bgcolor: '#b71c1c' }
                                }}
                              >
                                {t('schedule.register') || 'Register'}
                              </Button>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Alert severity="info" sx={{ textAlign: 'center' }}>
                  {t('schedule.noDates')}
                </Alert>
              )}
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default Schedule; 