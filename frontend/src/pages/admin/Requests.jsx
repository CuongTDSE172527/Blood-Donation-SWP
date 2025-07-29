import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Container, Typography, Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import { Add, Edit, Delete, CheckCircle } from '@mui/icons-material';
import { adminService } from '../../services/adminService';

export default function AdminRequests() {
  const { t } = useTranslation();
  const [requests, setRequests] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editRequest, setEditRequest] = useState(null);
  const [form, setForm] = useState({ patient: '', bloodType: '', units: 1, status: 'Pending', date: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

  // Load data from API
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [requestsRes, inventoryRes] = await Promise.all([
        adminService.getAllBloodRequests(),
        adminService.getBloodInventory()
      ]);
      setRequests(requestsRes);
      setInventory(inventoryRes);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (request = null) => {
    setEditRequest(request);
    setForm(request ? {
      patient: request.recipientName || request.patient,
      bloodType: request.recipientBloodType || request.bloodType,
      units: request.requestedAmount || request.units,
      status: request.status,
      date: request.requestDate || request.date
    } : { patient: '', bloodType: '', units: 1, status: 'Pending', date: '' });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleSave = async () => {
    try {
      if (editRequest) {
        await adminService.updateBloodRequest(editRequest.id, {
          recipientName: form.patient,
          recipientBloodType: form.bloodType,
          requestedAmount: form.units,
          status: form.status,
          requestDate: form.date
        });
        setRequests(requests.map(r => r.id === editRequest.id ? {
          ...r, 
          recipientName: form.patient,
          recipientBloodType: form.bloodType,
          requestedAmount: form.units,
          status: form.status,
          requestDate: form.date
        } : r));
      }
      handleClose();
      setSnackbar({ open: true, message: 'Request updated successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Failed to update request', severity: 'error' });
    }
  };
  
  const handleDelete = async (id) => {
    try {
      await adminService.deleteBloodRequest(id);
      setRequests(requests.filter(r => r.id !== id));
      setSnackbar({ open: true, message: 'Request deleted successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Failed to delete request', severity: 'error' });
    }
  };

  const handleComplete = async (request) => {
    try {
      await adminService.updateBloodRequest(request.id, { status: 'COMPLETED' });
      setRequests(requests.map(r => 
        r.id === request.id ? { ...r, status: 'COMPLETED' } : r
      ));
      setSnackbar({ open: true, message: t('admin.completeRequestSuccess') || 'Request completed successfully!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Failed to complete request', severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 50 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#fff5f5', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mb: 4, color: '#d32f2f', fontWeight: 700 }}>{t('admin.requestManagement')}</Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

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
                  {requests.length === 0 ? (
                    <TableRow><TableCell colSpan={6} align="center">{t('common.noData') || 'No data'}</TableCell></TableRow>
                  ) : requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.recipientName || request.patient}</TableCell>
                      <TableCell>{request.recipientBloodType || request.bloodType}</TableCell>
                      <TableCell>{request.requestedAmount || request.units}</TableCell>
                      <TableCell>
                        <Chip 
                          label={t(`status_${(request.status || '').toUpperCase()}`)} 
                          color={request.status === 'WAITING' ? 'success' : request.status === 'COMPLETED' ? 'default' : 'warning'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>{request.requestDate || request.date}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleOpen(request)}><Edit /></IconButton>
                        <IconButton color="error" onClick={() => handleDelete(request.id)}><Delete /></IconButton>
                        {(request.status === 'WAITING' || request.status === 'PENDING') && (
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
                  {inventory.length === 0 ? (
                    <TableRow><TableCell colSpan={2} align="center">{t('common.noData') || 'No data'}</TableCell></TableRow>
                  ) : inventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.bloodType}</TableCell>
                      <TableCell>{item.quantity || item.units}</TableCell>
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
            <FormControl fullWidth margin="dense">
              <InputLabel>{t('admin.status')}</InputLabel>
              <Select
                label={t('admin.status')}
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <MenuItem value="PENDING">{t('status_PENDING')}</MenuItem>
                <MenuItem value="WAITING">{t('status_WAITING')}</MenuItem>
                <MenuItem value="COMPLETED">{t('status_COMPLETED')}</MenuItem>
              </Select>
            </FormControl>
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