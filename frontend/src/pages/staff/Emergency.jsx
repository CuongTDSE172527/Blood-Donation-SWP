import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Container, Typography, Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

const mockEmergencies = [
  { id: 1, patient: 'Anna Lee', bloodType: 'AB+', units: 4, status: 'Urgent', date: '2024-03-21' },
  { id: 2, patient: 'Brian Kim', bloodType: 'O+', units: 2, status: 'Pending', date: '2024-03-22' },
];

export default function Emergency() {
  const { t } = useTranslation();
  const [emergencies, setEmergencies] = useState(mockEmergencies);
  const [open, setOpen] = useState(false);
  const [editEmergency, setEditEmergency] = useState(null);
  const [form, setForm] = useState({ patient: '', bloodType: '', units: 1, status: 'Pending', date: '' });

  const handleOpen = (emergency = null) => {
    setEditEmergency(emergency);
    setForm(emergency ? { ...emergency } : { patient: '', bloodType: '', units: 1, status: 'Pending', date: '' });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSave = () => {
    if (editEmergency) {
      setEmergencies(emergencies.map(e => e.id === editEmergency.id ? { ...form, id: editEmergency.id } : e));
    } else {
      setEmergencies([...emergencies, { ...form, id: emergencies.length + 1 }]);
    }
    handleClose();
  };
  const handleDelete = (id) => setEmergencies(emergencies.filter(e => e.id !== id));

  return (
    <Box sx={{ bgcolor: '#fff5f5', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ mb: 4, color: '#d32f2f', fontWeight: 700 }}>{t('staff.emergencyManagement')}</Typography>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Button variant="contained" startIcon={<Add />} sx={{ mb: 2, bgcolor: '#d32f2f' }} onClick={() => handleOpen()}>
              {t('staff.addEmergencyRequest')}
            </Button>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('staff.patient')}</TableCell>
                    <TableCell>{t('staff.bloodType')}</TableCell>
                    <TableCell>{t('staff.units')}</TableCell>
                    <TableCell>{t('staff.status')}</TableCell>
                    <TableCell>{t('staff.date')}</TableCell>
                    <TableCell align="right">{t('staff.actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {emergencies.map((emergency) => (
                    <TableRow key={emergency.id}>
                      <TableCell>{emergency.patient}</TableCell>
                      <TableCell>{emergency.bloodType}</TableCell>
                      <TableCell>{emergency.units}</TableCell>
                      <TableCell>
                        <Chip label={t('staff.status_' + emergency.status.toLowerCase())} color={emergency.status === 'Urgent' ? 'error' : 'warning'} size="small" />
                      </TableCell>
                      <TableCell>{emergency.date}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleOpen(emergency)}><Edit /></IconButton>
                        <IconButton color="error" onClick={() => handleDelete(emergency.id)}><Delete /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editEmergency ? t('staff.editEmergency') : t('staff.addEmergency')}</DialogTitle>
          <DialogContent>
            <TextField margin="dense" label={t('staff.patient')} name="patient" value={form.patient} onChange={handleChange} fullWidth />
            <TextField margin="dense" label={t('staff.bloodType')} name="bloodType" value={form.bloodType} onChange={handleChange} fullWidth />
            <TextField margin="dense" label={t('staff.units')} name="units" value={form.units} onChange={handleChange} fullWidth type="number" />
            <TextField margin="dense" label={t('staff.status')} name="status" value={form.status} onChange={handleChange} fullWidth />
            <TextField margin="dense" label={t('staff.date')} name="date" value={form.date} onChange={handleChange} fullWidth />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>{t('staff.cancel')}</Button>
            <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#d32f2f' }}>{editEmergency ? t('staff.save') : t('staff.add')}</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
} 