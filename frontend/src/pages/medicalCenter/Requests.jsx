import { useState, useEffect } from 'react';
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
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField,
  Grid,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { medicalCenterService } from '../../services/medicalCenterService';
import { BLOOD_TYPES, BLOOD_REQUEST_STATUS, STATUS_LABELS } from '../../constants/enums';
import { useAuth } from '../../hooks/useAuth';

export default function Requests() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editRequest, setEditRequest] = useState(null);
  const [form, setForm] = useState({
    recipientName: '',
    recipientBloodType: '',
    requestedAmount: 0,
    urgencyLevel: 'NORMAL',
    medicalReason: '',
    hospitalName: '',
    doctorName: '',
    contactPhone: '',
    contactEmail: '',
    notes: '',
    status: BLOOD_REQUEST_STATUS.PENDING
  });

  // Load requests data
  useEffect(() => {
    if (user?.id) {
      loadRequests(user.id);
    }
  }, [user]);

  const loadRequests = async (medicalCenterId) => {
    try {
      setLoading(true);
      const data = await medicalCenterService.getAllBloodRequests(medicalCenterId);
      setRequests(data);
    } catch (err) {
      setError(err.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (request = null) => {
    setEditRequest(request);
    if (request) {
      setForm({
        recipientName: request.recipientName || '',
        recipientBloodType: request.recipientBloodType || '',
        requestedAmount: request.requestedAmount || 0,
        urgencyLevel: request.urgencyLevel || 'NORMAL',
        medicalReason: request.medicalReason || '',
        hospitalName: request.hospitalName || '',
        doctorName: request.doctorName || '',
        contactPhone: request.contactPhone || '',
        contactEmail: request.contactEmail || '',
        notes: request.notes || '',
        status: request.status || BLOOD_REQUEST_STATUS.PENDING
      });
    } else {
      setForm({
        recipientName: '',
        recipientBloodType: '',
        requestedAmount: 0,
        urgencyLevel: 'NORMAL',
        medicalReason: '',
        hospitalName: '',
        doctorName: '',
        contactPhone: '',
        contactEmail: '',
        notes: '',
        status: BLOOD_REQUEST_STATUS.PENDING
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditRequest(null);
    setForm({
      recipientName: '',
      recipientBloodType: '',
      requestedAmount: 0,
      urgencyLevel: 'NORMAL',
      medicalReason: '',
      hospitalName: '',
      doctorName: '',
      contactPhone: '',
      contactEmail: '',
      notes: '',
      status: BLOOD_REQUEST_STATUS.PENDING
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'requestedAmount') {
      setForm({ ...form, [name]: Math.max(0, parseInt(value) || 0) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSave = async () => {
    try {
      if (editRequest) {
        // Update existing request
        await medicalCenterService.updateBloodRequest(editRequest.id, form);
        setRequests(requests.map(r => r.id === editRequest.id ? { ...r, ...form } : r));
      } else {
        // Create new request
        const newRequest = await medicalCenterService.createBloodRequest(form);
        setRequests([...requests, newRequest]);
      }
      handleClose();
    } catch (err) {
      setError(err.message || 'Failed to save request');
    }
  };

  const handleDelete = async (id) => {
    try {
      await medicalCenterService.deleteBloodRequest(id);
      setRequests(requests.filter(r => r.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete request');
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'CRITICAL':
        return 'error';
      case 'HIGH':
        return 'warning';
      case 'NORMAL':
        return 'info';
      default:
        return 'default';
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
          {t('medicalCenter.requestManagement') || 'Blood Request Management'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Card>
          <CardContent>
            <Button 
              variant="contained" 
              startIcon={<Add />} 
              sx={{ mb: 3, bgcolor: '#d32f2f' }} 
              onClick={() => handleOpen()}
            >
              {t('medicalCenter.addRequest') || 'Add Request'}
            </Button>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('medicalCenter.bloodType') || 'Blood Type'}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('medicalCenter.recipientName') || 'Recipient Name'}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('medicalCenter.requestDate') || 'Request Date'}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('medicalCenter.requestedAmount') || 'Requested Amount'}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('medicalCenter.status') || 'Status'}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('medicalCenter.urgencyLevel') || 'Urgency Level'}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>{t('medicalCenter.actions') || 'Actions'}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests
                    .filter(request => ['PENDING', 'OUT_OF_STOCK', 'WAITING', 'PRIORITY'].includes(request.status))
                    .map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{request.id}</TableCell>
                        <TableCell>
                          <Chip 
                            label={request.recipientBloodType} 
                            color="primary" 
                            size="small" 
                            sx={{ bgcolor: '#d32f2f' }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'medium' }}>{request.recipientName}</TableCell>
                        <TableCell>{request.requestDate ? new Date(request.requestDate).toLocaleDateString() : ''}</TableCell>
                        <TableCell>{request.requestedAmount}</TableCell>
                        <TableCell>
                          <Chip 
                            label={STATUS_LABELS && STATUS_LABELS[request.status] ? STATUS_LABELS[request.status] : request.status} 
                            color={getStatusColor(request.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={request.urgencyLevel} 
                            color={getUrgencyColor(request.urgencyLevel)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton 
                            onClick={() => handleOpen(request)}
                            sx={{ color: '#d32f2f' }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton 
                            color="error" 
                            onClick={() => handleDelete(request.id)}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Add/Edit Request Dialog */}
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>
            {editRequest ? t('medicalCenter.editRequest') || 'Edit Request' : t('medicalCenter.addRequest') || 'Add Request'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label={t('medicalCenter.recipientName') || 'Recipient Name'}
                  name="recipientName"
                  value={form.recipientName}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="dense">
                  <InputLabel>{t('medicalCenter.bloodType') || 'Blood Type'}</InputLabel>
                  <Select
                    label={t('medicalCenter.bloodType') || 'Blood Type'}
                    name="recipientBloodType"
                    value={form.recipientBloodType}
                    onChange={handleChange}
                  >
                    {BLOOD_TYPES.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label={t('medicalCenter.requestedAmount') || 'Requested Amount'}
                  name="requestedAmount"
                  type="number"
                  value={form.requestedAmount}
                  onChange={handleChange}
                  fullWidth
                  required
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="dense">
                  <InputLabel>{t('medicalCenter.urgencyLevel') || 'Urgency Level'}</InputLabel>
                  <Select
                    label={t('medicalCenter.urgencyLevel') || 'Urgency Level'}
                    name="urgencyLevel"
                    value={form.urgencyLevel}
                    onChange={handleChange}
                  >
                    <MenuItem value="LOW">Low</MenuItem>
                    <MenuItem value="MEDIUM">Medium</MenuItem>
                    <MenuItem value="HIGH">High</MenuItem>
                    <MenuItem value="CRITICAL">Critical</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {editRequest && (
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="dense">
                    <InputLabel>{t('medicalCenter.status') || 'Status'}</InputLabel>
                    <Select
                      label={t('medicalCenter.status') || 'Status'}
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                    >
                      <MenuItem value={BLOOD_REQUEST_STATUS.PENDING}>
                        {STATUS_LABELS[BLOOD_REQUEST_STATUS.PENDING]}
                      </MenuItem>
                      <MenuItem value={BLOOD_REQUEST_STATUS.WAITING}>
                        {STATUS_LABELS[BLOOD_REQUEST_STATUS.WAITING]}
                      </MenuItem>
                      <MenuItem value={BLOOD_REQUEST_STATUS.PRIORITY}>
                        {STATUS_LABELS[BLOOD_REQUEST_STATUS.PRIORITY]}
                      </MenuItem>
                      <MenuItem value={BLOOD_REQUEST_STATUS.OUT_OF_STOCK}>
                        {STATUS_LABELS[BLOOD_REQUEST_STATUS.OUT_OF_STOCK]}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>
              {t('medicalCenter.cancel') || 'Cancel'}
            </Button>
            <Button 
              onClick={handleSave} 
              variant="contained" 
              sx={{ bgcolor: '#d32f2f' }}
            >
              {editRequest ? t('medicalCenter.save') || 'Save' : t('medicalCenter.add') || 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
} 