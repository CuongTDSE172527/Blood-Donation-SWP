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
  Button,
  TextField,
  Grid
} from '@mui/material';
import { Edit, CheckCircle, Search, FilterList } from '@mui/icons-material';
import { staffService } from '../../services/staffService';
import { BLOOD_REQUEST_STATUS, STATUS_LABELS } from '../../constants/enums';

export default function Requests() {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth);
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editRequest, setEditRequest] = useState(null);
  const [form, setForm] = useState({ status: '' });
  const [success, setSuccess] = useState('');
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Load requests data
  useEffect(() => {
    loadRequests();
  }, []);

  // Filter and sort requests when data changes
  useEffect(() => {
    filterAndSortRequests();
  }, [requests, searchTerm, statusFilter, sortBy, sortOrder]);

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

  const filterAndSortRequests = () => {
    let filtered = [...requests];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(request => 
        (request.recipientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (request.recipientBloodType || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (request.id?.toString() || '').includes(searchTerm) ||
        (request.medicalCenter?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.requestDate || 0);
          bValue = new Date(b.requestDate || 0);
          break;
        case 'name':
          aValue = (a.recipientName || '').toLowerCase();
          bValue = (b.recipientName || '').toLowerCase();
          break;
        case 'bloodType':
          aValue = (a.recipientBloodType || '').toLowerCase();
          bValue = (b.recipientBloodType || '').toLowerCase();
          break;
        case 'amount':
          aValue = a.requestedAmount || 0;
          bValue = b.requestedAmount || 0;
          break;
        case 'status':
          aValue = (a.status || '').toLowerCase();
          bValue = (b.status || '').toLowerCase();
          break;
        case 'medicalCenter':
          aValue = (a.medicalCenter?.fullName || '').toLowerCase();
          bValue = (b.medicalCenter?.fullName || '').toLowerCase();
          break;
        default:
          aValue = a.id || 0;
          bValue = b.id || 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredRequests(filtered);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
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
        let newStatus = form.status;
        
        // Fix: Use correct API calls for each status
        switch (form.status) {
          case BLOOD_REQUEST_STATUS.WAITING:
            result = await staffService.confirmBloodRequest(editRequest.id);
            newStatus = 'WAITING';
            break;
          case BLOOD_REQUEST_STATUS.CONFIRM:
            result = await staffService.confirmBloodRequest(editRequest.id);
            newStatus = 'CONFIRM';
            break;
          case BLOOD_REQUEST_STATUS.PRIORITY:
            result = await staffService.markPriority(editRequest.id);
            newStatus = 'PRIORITY';
            break;
          case BLOOD_REQUEST_STATUS.OUT_OF_STOCK:
            result = await staffService.markOutOfStock(editRequest.id);
            newStatus = 'OUT_OF_STOCK';
            break;
          default:
            throw new Error('Invalid status');
        }

        // Update local state with the new status
        setRequests(requests.map(req => 
          req.id === editRequest.id 
            ? { ...req, status: newStatus }
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
      case BLOOD_REQUEST_STATUS.CONFIRM:
        return 'success';
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
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {/* Search and Filter Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label={t('staff.search') || 'Search requests...'}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                  placeholder={t('staff.searchPlaceholder') || 'Search by name, blood type, medical center, or ID...'}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>{t('staff.filterByStatus') || 'Filter by Status'}</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                    label={t('staff.filterByStatus') || 'Filter by Status'}
                  >
                    <MenuItem value="ALL">{t('staff.allStatuses') || 'All Statuses'}</MenuItem>
                    <MenuItem value="PENDING">{STATUS_LABELS[BLOOD_REQUEST_STATUS.PENDING]}</MenuItem>
                    <MenuItem value="WAITING">{STATUS_LABELS[BLOOD_REQUEST_STATUS.WAITING]}</MenuItem>
                    <MenuItem value="CONFIRM">{STATUS_LABELS[BLOOD_REQUEST_STATUS.CONFIRM]}</MenuItem>
                    <MenuItem value="PRIORITY">{STATUS_LABELS[BLOOD_REQUEST_STATUS.PRIORITY]}</MenuItem>
                    <MenuItem value="OUT_OF_STOCK">{STATUS_LABELS[BLOOD_REQUEST_STATUS.OUT_OF_STOCK]}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>{t('staff.sortBy') || 'Sort By'}</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    label={t('staff.sortBy') || 'Sort By'}
                  >
                    <MenuItem value="date">{t('staff.date') || 'Date'}</MenuItem>
                    <MenuItem value="name">{t('staff.patientName') || 'Patient Name'}</MenuItem>
                    <MenuItem value="bloodType">{t('staff.bloodType') || 'Blood Type'}</MenuItem>
                    <MenuItem value="amount">{t('staff.amount') || 'Amount'}</MenuItem>
                    <MenuItem value="status">{t('staff.status') || 'Status'}</MenuItem>
                    <MenuItem value="medicalCenter">{t('staff.medicalCenter') || 'Medical Center'}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                  startIcon={<FilterList />}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: '#d32f2f' }}>
                {t('staff.bloodRequests') || 'Blood Requests'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('staff.showingResults') || 'Showing'} {filteredRequests.length} {t('staff.of') || 'of'} {requests.length} {t('staff.requests') || 'requests'}
              </Typography>
            </Box>
            
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('staff.id') || 'ID'}</TableCell>
                    <TableCell>{t('staff.patientName') || 'Patient Name'}</TableCell>
                    <TableCell>{t('staff.bloodType') || 'Blood Type'}</TableCell>
                    <TableCell>{t('staff.amount') || 'Amount'}</TableCell>
                    <TableCell>{t('staff.status') || 'Status'}</TableCell>
                    <TableCell>{t('staff.medicalCenter') || 'Medical Center'}</TableCell>
                    <TableCell>{t('staff.requestDate') || 'Request Date'}</TableCell>
                    <TableCell align="right">{t('staff.actions') || 'Actions'}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        {searchTerm || statusFilter !== 'ALL' 
                          ? (t('staff.noMatchingRequests') || 'No matching requests found') 
                          : (t('common.noData') || 'No data')}
                      </TableCell>
                    </TableRow>
                  ) : filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.id}</TableCell>
                      <TableCell sx={{ fontWeight: 'medium' }}>{request.recipientName}</TableCell>
                      <TableCell>
                        <Chip 
                          label={request.recipientBloodType} 
                          color="primary" 
                          size="small" 
                          sx={{ bgcolor: '#d32f2f' }}
                        />
                      </TableCell>
                      <TableCell>{request.requestedAmount}</TableCell>
                      <TableCell>
                        <Chip 
                          label={STATUS_LABELS[request.status] || request.status} 
                          color={getStatusColor(request.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{request.medicalCenter?.fullName || 'N/A'}</TableCell>
                      <TableCell>
                        {request.requestDate ? new Date(request.requestDate).toLocaleDateString() : 'N/A'}
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
                <MenuItem value={BLOOD_REQUEST_STATUS.CONFIRM}>
                  {STATUS_LABELS[BLOOD_REQUEST_STATUS.CONFIRM]} - Mark as Confirmed
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