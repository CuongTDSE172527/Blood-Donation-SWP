import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
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
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Alert,
  CircularProgress,
  Button
} from '@mui/material';
import { Edit, CheckCircle } from '@mui/icons-material';
import { staffService } from '../../services/staffService';
import { BLOOD_REQUEST_STATUS, STATUS_LABELS } from '../../constants/enums';

export default function Requests() {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editRequest, setEditRequest] = useState(null);
  const [form, setForm] = useState({ status: '' });
  const [success, setSuccess] = useState('');

  // Load requests data
  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await staffService.getAllBloodRequests();
      setRequests(data);
    } catch (err) {
      setError(err.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (request = null) => {
    setEditRequest(request);
    setForm({ status: request?.status || '' });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditRequest(null);
    setForm({ status: '' });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
    if (editRequest) {
        // Update request status based on selection
        let result;
        switch (form.status) {
          case BLOOD_REQUEST_STATUS.WAITING:
            result = await staffService.confirmBloodRequest(editRequest.id);
            break;
          case BLOOD_REQUEST_STATUS.PRIORITY:
            result = await staffService.markPriority(editRequest.id);
            break;
          case BLOOD_REQUEST_STATUS.OUT_OF_STOCK:
            result = await staffService.markOutOfStock(editRequest.id);
            break;
          default:
            throw new Error('Invalid status');
        }

        // Update local state
        setRequests(requests.map(req => 
          req.id === editRequest.id 
            ? { ...req, status: form.status }
            : req
        ));

        setSuccess('Request status updated successfully');
    handleClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to update request status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case BLOOD_REQUEST_STATUS.PENDING:
        return 'warning';
      case BLOOD_REQUEST_STATUS.WAITING:
        return 'info';
      case BLOOD_REQUEST_STATUS.PRIORITY:
        return 'error';
      case BLOOD_REQUEST_STATUS.OUT_OF_STOCK:
        return 'default';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#fff5f5', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mb: 4, color: '#d32f2f', fontWeight: 700 }}>
          {t('staff.requestManagement') || 'Blood Request Management'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, color: '#d32f2f' }}>
              {t('staff.allBloodRequests') || 'All Blood Requests'}
            </Typography>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {t('staff.recipientName') || 'Recipient Name'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {t('staff.bloodType') || 'Blood Type'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {t('staff.requestedAmount') || 'Requested Amount'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {t('staff.urgencyLevel') || 'Urgency Level'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {t('staff.status') || 'Status'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {t('staff.requestDate') || 'Request Date'}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      {t('staff.actions') || 'Actions'}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell sx={{ fontWeight: 'medium' }}>
                        {request.recipientName}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={request.recipientBloodType} 
                          color="primary" 
                          size="small" 
                          sx={{ bgcolor: '#d32f2f' }}
                        />
                      </TableCell>
                      <TableCell>
                        {request.requestedAmount} units
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={request.urgencyLevel} 
                          color={request.urgencyLevel === 'CRITICAL' ? 'error' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={t(`status_${(request.status || '').toUpperCase()}`)} 
                          color={getStatusColor(request.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(request.requestDate).toLocaleDateString()}
                      </TableCell>
                        <TableCell align="right">
                        <IconButton 
                          onClick={() => handleOpen(request)}
                          sx={{ color: '#d32f2f' }}
                        >
                          <Edit />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Edit Status Dialog */}
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            {t('staff.editRequestStatus') || 'Edit Request Status'}
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
              {t('staff.currentStatus') || 'Current Status'}: {STATUS_LABELS[editRequest?.status] || editRequest?.status}
            </Typography>
              <FormControl fullWidth margin="dense">
              <InputLabel>{t('staff.newStatus') || 'New Status'}</InputLabel>
                <Select
                label={t('staff.newStatus') || 'New Status'}
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                <MenuItem value={BLOOD_REQUEST_STATUS.WAITING}>
                  {STATUS_LABELS[BLOOD_REQUEST_STATUS.WAITING]} - Confirm Request
                </MenuItem>
                <MenuItem value={BLOOD_REQUEST_STATUS.PRIORITY}>
                  {STATUS_LABELS[BLOOD_REQUEST_STATUS.PRIORITY]} - Mark as Priority
                </MenuItem>
                <MenuItem value={BLOOD_REQUEST_STATUS.OUT_OF_STOCK}>
                  {STATUS_LABELS[BLOOD_REQUEST_STATUS.OUT_OF_STOCK]} - Mark as Out of Stock
                      </MenuItem>
                  </Select>
                </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>
              {t('staff.cancel') || 'Cancel'}
            </Button>
            <Button 
              onClick={handleSave} 
              variant="contained" 
              sx={{ bgcolor: '#d32f2f' }}
              disabled={!form.status || form.status === editRequest?.status}
            >
              {t('staff.updateStatus') || 'Update Status'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
} 