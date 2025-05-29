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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 6, maxWidth: 700, mx: 'auto', position: 'relative', zIndex: 2 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, textAlign: 'center' }}>
          <LocalHospital sx={{ mr: 1, verticalAlign: 'middle' }} />
          {t('schedule.title')}
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center', fontWeight: 600 }}>
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
        <Button
          variant="contained"
          color="primary"
          sx={{ height: 56, mt: { xs: 2, md: 0 }, fontWeight: 600, px: 5, float: 'right' }}
          onClick={handleSearch}
        >
          {t('schedule.search')}
        </Button>
        {searched && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              {t('schedule.availableDates')}:
            </Typography>
            {results.length > 0 ? (
              <Grid container spacing={2}>
                {results.map(date => (
                  <Grid item key={date}>
                    <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText', borderRadius: 2, minWidth: 120, textAlign: 'center' }}>
                      {dayjs(date).format('DD/MM/YYYY')}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography color="error">{t('schedule.noDates')}</Typography>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Schedule; 