import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Container, Typography, Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert, FormControl, InputLabel, Select, MenuItem, CircularProgress, Grid } from '@mui/material';
import { Add, Edit, Delete, CheckCircle, Search, FilterList, Info } from '@mui/icons-material';
import { adminService } from '../../services/adminService';
import BloodCompatibilityInfo from '../../components/BloodCompatibilityInfo';

export default function AdminRequests() {
  const { t } = useTranslation();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editRequest, setEditRequest] = useState(null);
  const [form, setForm] = useState({ patient: '', bloodType: '', units: 1, status: 'Pending', date: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Blood compatibility states
  const [compatibilityDialog, setCompatibilityDialog] = useState({ open: false, data: null, loading: false });

  // Load data from API
  useEffect(() => {
    loadData();
  }, []);

  // Filter and sort requests when data changes
  useEffect(() => {
    filterAndSortRequests();
  }, [requests, searchTerm, statusFilter, sortBy, sortOrder]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading blood requests and inventory...');
      
      const [requestsRes, inventoryRes] = await Promise.all([
        adminService.getAllBloodRequests(),
        adminService.getBloodInventory()
      ]);
      
      console.log('Blood requests loaded:', requestsRes);
      console.log('Inventory loaded:', inventoryRes);
      
      setRequests(requestsRes);
      setInventory(inventoryRes);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortRequests = () => {
    let filtered = [...requests];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(request => 
        (request.recipientName || request.patient || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (request.recipientBloodType || request.bloodType || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (request.id?.toString() || '').includes(searchTerm)
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
          aValue = new Date(a.requestDate || a.date || 0);
          bValue = new Date(b.requestDate || b.date || 0);
          break;
        case 'name':
          aValue = (a.recipientName || a.patient || '').toLowerCase();
          bValue = (b.recipientName || b.patient || '').toLowerCase();
          break;
        case 'bloodType':
          aValue = (a.recipientBloodType || a.bloodType || '').toLowerCase();
          bValue = (b.recipientBloodType || b.bloodType || '').toLowerCase();
          break;
        case 'amount':
          aValue = a.requestedAmount || a.units || 0;
          bValue = b.requestedAmount || b.units || 0;
          break;
        case 'status':
          aValue = (a.status || '').toLowerCase();
          bValue = (b.status || '').toLowerCase();
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
    setForm(request ? {
      patient: request.recipientName || request.patient || '',
      bloodType: request.recipientBloodType || request.bloodType || '',
      units: request.requestedAmount || request.units || 1,
      status: request.status || 'Pending',
      date: request.requestDate || request.date || ''
    } : { patient: '', bloodType: '', units: 1, status: 'Pending', date: '' });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleSave = async () => {
    try {
      if (editRequest) {
        await adminService.updateBloodRequest(editRequest.id, form);
        setRequests(requests.map(r => r.id === editRequest.id ? { ...r, ...form } : r));
      }
      handleClose();
    } catch (err) {
      setError(err.message || 'Failed to save request');
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminService.deleteBloodRequest(id);
      setRequests(requests.filter(r => r.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete request');
    }
  };

  const handleComplete = async (request) => {
    try {
      await adminService.confirmBloodRequest(request.id);
      
      // Logic cập nhật trạng thái dựa trên trạng thái hiện tại
      let newStatus;
      if (request.status === 'PENDING' || request.status === 'WAITING') {
        newStatus = 'CONFIRM';
      } else {
        newStatus = 'WAITING';
      }
      
      setRequests(requests.map(r => 
        r.id === request.id ? { ...r, status: newStatus } : r
      ));
      
      // Reload inventory to reflect the deduction
      const updatedInventory = await adminService.getBloodInventory();
      setInventory(updatedInventory);
      setSnackbar({ open: true, message: t('admin.confirmRequestSuccess') || 'Request confirmed successfully!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Failed to confirm request', severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const handleCheckCompatibility = async (bloodType, requestedAmount) => {
    try {
      setCompatibilityDialog({ open: true, data: null, loading: true });
      const data = await adminService.checkBloodCompatibility(bloodType, requestedAmount);
      setCompatibilityDialog({ open: true, data, loading: false });
    } catch (err) {
      setCompatibilityDialog({ open: false, data: null, loading: false });
      setSnackbar({ open: true, message: err.message || 'Failed to check compatibility', severity: 'error' });
    }
  };

  const handleCloseCompatibilityDialog = () => {
    setCompatibilityDialog({ open: false, data: null, loading: false });
  };

  const handleConfirmWithAlternative = async (alternativeBloodType) => {
    try {
      // Find the current request being viewed
      const currentRequest = requests.find(r => 
        (r.recipientBloodType || r.bloodType) === compatibilityDialog.data?.requestedBloodType
      );
      
      if (!currentRequest) {
        setSnackbar({ open: true, message: 'Không tìm thấy request tương ứng', severity: 'error' });
        return;
      }

      await adminService.confirmBloodRequestWithCompatibility(currentRequest.id, alternativeBloodType);
      
      // Update local state
      setRequests(requests.map(r => 
        r.id === currentRequest.id ? { ...r, status: 'CONFIRM' } : r
      ));
      
      // Reload inventory
      const updatedInventory = await adminService.getBloodInventory();
      setInventory(updatedInventory);
      
      // Close dialog
      setCompatibilityDialog({ open: false, data: null, loading: false });
      
      setSnackbar({ 
        open: true, 
        message: `Request confirmed with alternative blood type: ${alternativeBloodType}`, 
        severity: 'success' 
      });
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Failed to confirm with alternative', severity: 'error' });
    }
  };

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

        {/* Search and Filter Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label={t('admin.search') || 'Search requests...'}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                  placeholder={t('admin.searchPlaceholder') || 'Search by name, blood type, or ID...'}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>{t('admin.filterByStatus') || 'Filter by Status'}</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                    label={t('admin.filterByStatus') || 'Filter by Status'}
                  >
                    <MenuItem value="ALL">{t('admin.allStatuses') || 'All Statuses'}</MenuItem>
                    <MenuItem value="PENDING">{t('status_PENDING') || 'Pending'}</MenuItem>
                    <MenuItem value="WAITING">{t('status_WAITING') || 'Processing'}</MenuItem>
                    <MenuItem value="CONFIRM">{t('status_CONFIRM') || 'Confirmed'}</MenuItem>
                    <MenuItem value="PRIORITY">{t('status_PRIORITY') || 'Priority'}</MenuItem>
                    <MenuItem value="OUT_OF_STOCK">{t('status_OUT_OF_STOCK') || 'Out of Stock'}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>{t('admin.sortBy') || 'Sort By'}</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    label={t('admin.sortBy') || 'Sort By'}
                  >
                    <MenuItem value="date">{t('admin.date') || 'Date'}</MenuItem>
                    <MenuItem value="name">{t('admin.patient') || 'Patient Name'}</MenuItem>
                    <MenuItem value="bloodType">{t('admin.bloodType') || 'Blood Type'}</MenuItem>
                    <MenuItem value="amount">{t('admin.units') || 'Amount'}</MenuItem>
                    <MenuItem value="status">{t('admin.status') || 'Status'}</MenuItem>
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

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: '#d32f2f' }}>
                {t('admin.bloodRequests') || 'Blood Requests'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('admin.showingResults') || 'Showing'} {filteredRequests.length} {t('admin.of') || 'of'} {requests.length} {t('admin.requests') || 'requests'}
              </Typography>
            </Box>
            
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
                  {filteredRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        {searchTerm || statusFilter !== 'ALL' 
                          ? (t('admin.noMatchingRequests') || 'No matching requests found') 
                          : (t('common.noData') || 'No data')}
                      </TableCell>
                    </TableRow>
                  ) : filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.recipientName || request.patient}</TableCell>
                      <TableCell>{request.recipientBloodType || request.bloodType}</TableCell>
                      <TableCell>{request.requestedAmount || request.units}</TableCell>
                      <TableCell>
                        <Chip 
                          label={t(`status_${(request.status || '').toUpperCase()}`)} 
                          color={request.status === 'WAITING' ? 'info' : request.status === 'CONFIRM' ? 'success' : 'warning'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>{request.requestDate || request.date}</TableCell>
                      <TableCell align="right">
                        <IconButton 
                          onClick={() => handleCheckCompatibility(
                            request.recipientBloodType || request.bloodType, 
                            request.requestedAmount || request.units
                          )}
                          title={t('bloodCompatibility.check') || 'Kiểm tra tính tương thích'}
                        >
                          <Info />
                        </IconButton>
                        <IconButton onClick={() => handleOpen(request)}><Edit /></IconButton>
                        <IconButton color="error" onClick={() => handleDelete(request.id)}><Delete /></IconButton>
                        {(request.status === 'WAITING' || request.status === 'PENDING' || request.status === 'PROCESSING') && (
                          <IconButton color="success" onClick={() => handleComplete(request)} title={t('admin.confirm')}>
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
                <MenuItem value="CONFIRM">{t('status_CONFIRM')}</MenuItem>
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

        {/* Blood Compatibility Dialog */}
        <Dialog 
          open={compatibilityDialog.open} 
          onClose={handleCloseCompatibilityDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {t('bloodCompatibility.title') || 'Thông tin tính tương thích nhóm máu'}
          </DialogTitle>
          <DialogContent>
            {compatibilityDialog.loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <BloodCompatibilityInfo 
                compatibilityData={compatibilityDialog.data} 
                showDetails={true}
                onConfirmWithAlternative={handleConfirmWithAlternative}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCompatibilityDialog}>
              {t('common.close') || 'Đóng'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
} 