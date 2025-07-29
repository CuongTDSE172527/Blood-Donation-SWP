import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Grid,
} from '@mui/material';
import { LocalHospital } from '@mui/icons-material';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

const sectionBg = '#fff5f5';
const cardShadow = '0 4px 24px 0 rgba(211,47,47,0.07)';

const mockAvailableDates = [
  '2024-06-10',
  '2024-06-12',
  '2024-06-15',
  '2024-06-18',
  '2024-06-20',
  '2024-06-25',
];

const Schedule = () => {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState([null, null]);
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    setSearched(true);
    if (dateRange[0] && dateRange[1]) {
      const start = dayjs(dateRange[0]);
      const end = dayjs(dateRange[1]);
      const filtered = mockAvailableDates.filter(date => {
        const d = dayjs(date);
        return d.isAfter(start.subtract(1, 'day')) && d.isBefore(end.add(1, 'day'));
      });
      setResults(filtered);
    } else {
      setResults([]);
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
          {searched && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#d32f2f' }}>
                {t('schedule.availableDates')}:
              </Typography>
              {results.length > 0 ? (
                <Grid container spacing={2} justifyContent="center">
                  {results.map(date => (
                    <Grid item key={date}>
                      <Paper sx={{ p: 2, bgcolor: sectionBg, color: '#d32f2f', borderRadius: 2, minWidth: 120, textAlign: 'center', fontWeight: 600, boxShadow: cardShadow }}>
                        {dayjs(date).format('DD/MM/YYYY')}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography color="error" align="center">{t('schedule.noDates')}</Typography>
              )}
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default Schedule; 