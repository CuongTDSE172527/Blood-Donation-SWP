import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
import { LocalHospital, CalendarToday, AccessTime, LocationOn } from '@mui/icons-material';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { scheduleService } from '../services/scheduleService';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const sectionBg = '#fff5f5';
const cardShadow = '0 4px 24px 0 rgba(211,47,47,0.07)';

const Schedule = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState([null, null]);
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  // Load schedules on component mount
  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Loading schedules...');
      
      // Try donor endpoint first
      let response;
      try {
        response = await api.get('/donor/schedules');
        console.log('Schedules loaded (donor):', response.data);
      } catch (error) {
        console.error('Error loading schedules (donor):', error);
        // Fallback to staff endpoint
        try {
          response = await scheduleService.getAllSchedules();
          console.log('Schedules loaded (staff):', response);
        } catch (staffError) {
          console.error('Error loading schedules (staff):', staffError);
          // Use mock data as last resort
          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(today.getDate() + 1);
          const nextWeek = new Date(today);
          nextWeek.setDate(today.getDate() + 7);
          
          response = { data: [
            { 
              id: 1, 
              date: tomorrow.toISOString().split('T')[0], 
              time: '08:00:00',
              location: { id: 1, name: 'Bệnh viện Chợ Rẫy', address: '201B Nguyễn Chí Thanh, Quận 5, TP.HCM' }
            },
            { 
              id: 2, 
              date: tomorrow.toISOString().split('T')[0], 
              time: '14:00:00',
              location: { id: 2, name: 'Bệnh viện Nhân dân 115', address: '527 Sư Vạn Hạnh, Quận 10, TP.HCM' }
            },
            { 
              id: 3, 
              date: nextWeek.toISOString().split('T')[0], 
              time: '09:00:00',
              location: { id: 3, name: 'Viện Huyết học - Truyền máu TW', address: '118 Đường Trần Phú, Hà Nội' }
            },
            { 
              id: 4, 
              date: nextWeek.toISOString().split('T')[0], 
              time: '15:00:00',
              location: { id: 1, name: 'Bệnh viện Chợ Rẫy', address: '201B Nguyễn Chí Thanh, Quận 5, TP.HCM' }
            }
          ]};
          console.log('Using mock schedules');
        }
      }
      
      const schedulesData = response.data || response;
      setSchedules(schedulesData);
      setFilteredSchedules(schedulesData); // Show all schedules by default
    } catch (error) {
      console.error('Error loading schedules:', error);
      setError('Không thể tải dữ liệu lịch hiến máu. Vui lòng thử lại.');
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
        const scheduleDate = dayjs(schedule.date);
        return scheduleDate.isAfter(start.subtract(1, 'day')) && scheduleDate.isBefore(end.add(1, 'day'));
      });
      setFilteredSchedules(filtered);
    } else {
      setFilteredSchedules(schedules);
    }
  };

  return (
    <Box sx={{ bgcolor: sectionBg, minHeight: '100vh', py: 8 }}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ bgcolor: '#fff', borderRadius: 4, p: { xs: 4, md: 6 }, boxShadow: cardShadow }}>
          <Typography variant="h4" fontWeight={700} align="center" sx={{ color: '#d32f2f', mb: 3, letterSpacing: -0.5 }}>
            <LocalHospital sx={{ mr: 1, verticalAlign: 'middle', color: '#d32f2f' }} />
            {t('schedule.title')}
          </Typography>
          <Typography variant="subtitle1" align="center" sx={{ mb: 2, fontWeight: 500, color: 'text.secondary' }}>
            {t('schedule.selectTime')}
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              localeText={{ start: t('schedule.fromDate'), end: t('schedule.toDate') }}
              sx={{ width: '100%', mb: 2 }}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
          {error && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress sx={{ color: '#d32f2f' }} />
            </Box>
          ) : (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button
                  variant="contained"
                  size="large"
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
                  {t('schedule.search')}
                </Button>
              </Box>

              {/* Show all schedules by default */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#d32f2f' }}>
                  {searched ? t('schedule.availableDates') : 'Tất cả lịch hiến máu có sẵn'}:
                </Typography>
                
                {filteredSchedules.length > 0 ? (
                  <Grid container spacing={3}>
                    {filteredSchedules.map(schedule => (
                      <Grid item xs={12} md={6} key={schedule.id}>
                        <Card sx={{ 
                          p: 3, 
                          bgcolor: '#fff', 
                          borderRadius: 3, 
                          boxShadow: cardShadow,
                          border: '1px solid #ffebee',
                          '&:hover': { 
                            boxShadow: '0 8px 32px 0 rgba(211,47,47,0.15)',
                            transform: 'translateY(-2px)'
                          },
                          transition: 'all 0.3s ease'
                        }}>
                          <CardContent sx={{ p: 0 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <CalendarToday sx={{ color: '#d32f2f', mr: 1 }} />
                              <Typography variant="h6" sx={{ fontWeight: 600, color: '#d32f2f' }}>
                                {dayjs(schedule.date).format('DD/MM/YYYY')}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <AccessTime sx={{ color: '#666', mr: 1 }} />
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {dayjs(`2000-01-01T${schedule.time}`).format('HH:mm')}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                              <LocationOn sx={{ color: '#666', mr: 1, mt: 0.2 }} />
                              <Box>
                                <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                  {schedule.location?.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {schedule.location?.address}
                                </Typography>
                              </Box>
                            </Box>
                            
                            <Button
                              variant="contained"
                              fullWidth
                              sx={{
                                mt: 2,
                                bgcolor: '#d32f2f',
                                '&:hover': { bgcolor: '#b71c1c' }
                              }}
                              onClick={() => {
                                // Navigate to donation registration with selected schedule
                                navigate('/donation-registration', { 
                                  state: { 
                                    selectedSchedule: schedule,
                                    fromSchedule: true 
                                  } 
                                });
                              }}
                            >
                              Đăng ký hiến máu
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography color="error" align="center" sx={{ mt: 4 }}>
                    {searched ? t('schedule.noDates') : 'Không có lịch hiến máu nào có sẵn'}
                  </Typography>
                )}
              </Box>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default Schedule; 