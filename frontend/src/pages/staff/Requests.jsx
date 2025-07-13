import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Chip, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem 
} from '@mui/material';
import { Add, Edit, Delete, CheckCircle } from '@mui/icons-material';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
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

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function Requests() {
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
      // Only update status for existing requests
      setRequests(requests.map(r => r.id === editRequest.id ? { ...r, status: form.status } : r));
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
        insufficientMsg: t('staff.insufficientInventory'),
        successMsg: t('staff.completeRequestSuccess'),
      }
    );
    setRequests(updatedRequests);
    setInventory(updatedInventory);
    setSnackbar({ open: true, message: result.message, severity: result.severity });
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Box sx={{ bgcolor: '#fff5f5', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ mb: 4, color: '#d32f2f', fontWeight: 700 }}>{t('staff.requestManagement')}</Typography>
        <Card sx={{ mb: 3 }}>
          <CardContent>
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
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.patient}</TableCell>
                      <TableCell>{request.bloodType}</TableCell>
                      <TableCell>{request.units}</TableCell>
                      <TableCell>
                        <Chip label={t('staff.status_' + request.status.toLowerCase())} color={request.status === 'Approved' ? 'success' : request.status === 'Completed' ? 'default' : 'warning'} size="small" />
                      </TableCell>
                      <TableCell>{request.date}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleOpen(request)}><Edit /></IconButton>
                        <IconButton color="error" onClick={() => handleDelete(request.id)}><Delete /></IconButton>
                        {(request.status === 'Approved' || request.status === 'Pending') && (
                          <IconButton color="success" onClick={() => handleComplete(request)} title={t('staff.complete')}>
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
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editRequest ? t('staff.editRequest') : t('staff.addRequest')}</DialogTitle>
          <DialogContent>
            {editRequest ? (
              // For editing, only show status field
              <FormControl fullWidth margin="dense">
                <InputLabel>{t('staff.status')}</InputLabel>
                <Select
                  label={t('staff.status')}
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <MenuItem value="Pending">{t('staff.status_pending')}</MenuItem>
                  <MenuItem value="Approved">{t('staff.status_approved')}</MenuItem>
                  <MenuItem value="Completed">{t('staff.status_completed')}</MenuItem>
                </Select>
              </FormControl>
            ) : (
              // For adding new request, show all fields
              <>
                <TextField margin="dense" label={t('staff.patient')} name="patient" value={form.patient} onChange={handleChange} fullWidth />
                <FormControl fullWidth margin="dense">
                  <InputLabel>{t('staff.bloodType')}</InputLabel>
                  <Select
                    label={t('staff.bloodType')}
                    name="bloodType"
                    value={form.bloodType}
                    onChange={handleChange}
                  >
                    {bloodTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField margin="dense" label={t('staff.units')} name="units" value={form.units} onChange={handleChange} fullWidth type="number" />
                <FormControl fullWidth margin="dense">
                  <InputLabel>{t('staff.status')}</InputLabel>
                  <Select
                    label={t('staff.status')}
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <MenuItem value="Pending">{t('staff.status_pending')}</MenuItem>
                    <MenuItem value="Approved">{t('staff.status_approved')}</MenuItem>
                    <MenuItem value="Completed">{t('staff.status_completed')}</MenuItem>
                  </Select>
                </FormControl>
                <TextField margin="dense" label={t('staff.date')} name="date" value={form.date} onChange={handleChange} fullWidth />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>{t('staff.cancel')}</Button>
            <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#d32f2f' }}>{editRequest ? t('staff.save') : t('staff.add')}</Button>
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