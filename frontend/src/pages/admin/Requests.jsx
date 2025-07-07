import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Container, Typography, Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert } from '@mui/material';
import { Add, Edit, Delete, CheckCircle } from '@mui/icons-material';
import { completeBloodRequest } from '../../utils/testHelpers';

const mockRequests = [
  { id: 1, patient: 'Sarah Wilson', bloodType: 'A+', units: 2, status: 'Pending', date: '2024-03-20' },
  { id: 2, patient: 'Tom Brown', bloodType: 'O-', units: 1, status: 'Approved', date: '2024-03-19' },
  { id: 3, patient: 'Lisa Davis', bloodType: 'B+', units: 3, status: 'Pending', date: '2024-03-18' },
];

const mockInventory = [
  { id: 1, bloodType: 'A+', units: 25 },
  { id: 2, bloodType: 'O-', units: 15 },
  { id: 3, bloodType: 'B+', units: 30 },
];

export default function AdminRequests() {
  const { t } = useTranslation();
  const [requests, setRequests] = useState(mockRequests);
  const [inventory, setInventory] = useState(mockInventory);
  const [open, setOpen] = useState(false);
  const [editRequest, setEditRequest] = useState(null);
  const [form, setForm] = useState({ patient: '', bloodType: '', units: 1, status: 'Pending', date: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

  const handleOpen = (request = null) => {
    setEditRequest(request);
    setForm(request ? { ...request } : { patient: '', bloodType: '', units: 1, status: 'Pending', date: '' });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSave = () => {
    if (editRequest) {
      setRequests(requests.map(r => r.id === editRequest.id ? { ...form, id: editRequest.id } : r));
    } else {
      setRequests([...requests, { ...form, id: requests.length + 1 }]);
    }
    handleClose();
  };
  const handleDelete = (id) => setRequests(requests.filter(r => r.id !== id));

  const handleComplete = (request) => {
    const { updatedRequests, updatedInventory, result } = completeBloodRequest(
      request,
      requests,
      inventory,
      {
        insufficientMsg: t('admin.insufficientInventory'),
        successMsg: t('admin.completeRequestSuccess'),
      }
    );
    setRequests(updatedRequests);
    setInventory(updatedInventory);
    setSnackbar({ open: true, message: result.message, severity: result.severity });
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Box sx={{ bgcolor: '#fff5f5', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mb: 4, color: '#d32f2f', fontWeight: 700 }}>{t('admin.requestManagement')}</Typography>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('admin.patient')}</TableCell>
                    <TableCell>{t('admin.bloodType')}</TableCell>
                    <TableCell>{t('admin.units')}</TableCell>
                    <TableCell>{t('admin.status')}</TableCell>
                    <TableCell>{t('admin.date')}</TableCell>
                    <TableCell align="right">{t('admin.actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.patient}</TableCell>
                      <TableCell>{request.bloodType}</TableCell>
                      <TableCell>{request.units}</TableCell>
                      <TableCell>
                        <Chip label={t('admin.status_' + request.status.toLowerCase())} color={request.status === 'Approved' ? 'success' : request.status === 'Completed' ? 'default' : 'warning'} size="small" />
                      </TableCell>
                      <TableCell>{request.date}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleOpen(request)}><Edit /></IconButton>
                        <IconButton color="error" onClick={() => handleDelete(request.id)}><Delete /></IconButton>
                        {(request.status === 'Approved' || request.status === 'Pending') && (
                          <IconButton color="success" onClick={() => handleComplete(request)} title={t('admin.complete')}>
                            <CheckCircle />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: '#d32f2f', mb: 2 }}>{t('admin.currentInventory')}</Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('admin.bloodType')}</TableCell>
                    <TableCell>{t('admin.units')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.bloodType}</TableCell>
                      <TableCell>{item.units}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editRequest ? t('admin.editRequest') : t('admin.addRequest')}</DialogTitle>
          <DialogContent>
            <TextField margin="dense" label={t('admin.patient')} name="patient" value={form.patient} onChange={handleChange} fullWidth />
            <TextField margin="dense" label={t('admin.bloodType')} name="bloodType" value={form.bloodType} onChange={handleChange} fullWidth />
            <TextField margin="dense" label={t('admin.units')} name="units" value={form.units} onChange={handleChange} fullWidth type="number" />
            <TextField margin="dense" label={t('admin.status')} name="status" value={form.status} onChange={handleChange} fullWidth />
            <TextField margin="dense" label={t('admin.date')} name="date" value={form.date} onChange={handleChange} fullWidth />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>{t('admin.cancel')}</Button>
            <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#d32f2f' }}>{editRequest ? t('admin.save') : t('admin.add')}</Button>
          </DialogActions>
        </Dialog>
        <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
} 