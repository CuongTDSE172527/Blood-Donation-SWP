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
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import { Edit, Delete, Warning } from '@mui/icons-material';
import { adminService } from '../../services/adminService';

export default function Inventory() {
  const { t } = useTranslation();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ quantity: 0 });

  // Blood inventory alert thresholds
  const LOW_STOCK_THRESHOLD = 10;
  const CRITICAL_STOCK_THRESHOLD = 5;

  // Load inventory data
  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const data = await adminService.getBloodInventory();
      setInventory(data);
    } catch (err) {
      setError(err.message || 'Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (item = null) => {
    setEditItem(item);
    setForm(item ? { quantity: item.quantity } : { quantity: 0 });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleSave = async () => {
    try {
      if (editItem) {
        await adminService.updateBloodInventory(editItem.id, { quantity: form.quantity });
        setInventory(inventory.map(i => i.id === editItem.id ? { ...i, quantity: form.quantity } : i));
      }
      handleClose();
    } catch (err) {
      setError(err.message || 'Failed to update inventory');
    }
  };
  
  const handleDelete = async (id) => {
    try {
      await adminService.deleteBloodInventory(id);
      setInventory(inventory.filter(i => i.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete inventory item');
    }
  };

  // Check for low stock alerts
  const getStockAlert = (quantity) => {
    if (quantity <= CRITICAL_STOCK_THRESHOLD) {
      return { severity: 'error', message: 'Critical Low Stock' };
    } else if (quantity <= LOW_STOCK_THRESHOLD) {
      return { severity: 'warning', message: 'Low Stock' };
    }
    return null;
  };

  const getStockColor = (quantity) => {
    if (quantity <= CRITICAL_STOCK_THRESHOLD) return 'error';
    if (quantity <= LOW_STOCK_THRESHOLD) return 'warning';
    return 'success';
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
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ mb: 2, color: '#d32f2f', fontWeight: 700 }}>
          {t('admin.inventoryManagement') || 'Blood Inventory Management'}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontStyle: 'italic' }}>
          💡 Lưu ý: 1 unit máu = 450ml (theo tiêu chuẩn quốc tế)
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Stock Alerts */}
        {inventory.some(item => item.quantity <= LOW_STOCK_THRESHOLD) && (
          <Alert 
            severity="warning" 
            sx={{ mb: 3 }} 
            icon={<Warning />}
          >
            <Typography variant="body1" fontWeight="bold">
              Blood Stock Alert
            </Typography>
            <Typography variant="body2">
              Some blood types are running low. Please check the inventory below.
            </Typography>
          </Alert>
        )}

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {t('admin.bloodType') || 'Blood Type'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {t('admin.units') || 'Units'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      Status
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      {t('admin.actions') || 'Actions'}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inventory.map((item) => {
                    const stockAlert = getStockAlert(item.quantity);
                    return (
                      <TableRow key={item.id}>
                        <TableCell sx={{ fontWeight: 'medium' }}>
                          {item.bloodType}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {item.quantity}
                            {stockAlert && (
                              <Chip
                                icon={<Warning />}
                                label={stockAlert.message}
                                color={stockAlert.severity}
                                size="small"
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={item.quantity > LOW_STOCK_THRESHOLD ? 'In Stock' : 'Low Stock'}
                            color={getStockColor(item.quantity)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton 
                            onClick={() => handleOpen(item)}
                            sx={{ color: '#d32f2f' }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton 
                            color="error" 
                            onClick={() => handleDelete(item.id)}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            {t('admin.editBloodType') || 'Edit Blood Type'}
          </DialogTitle>
          <DialogContent>
            <TextField 
              margin="dense" 
              label={t('admin.units') || 'Units'} 
              name="quantity" 
              value={form.quantity} 
              onChange={handleChange} 
              fullWidth 
              type="number"
              inputProps={{ min: 0 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>
              {t('admin.cancel') || 'Cancel'}
            </Button>
            <Button 
              onClick={handleSave} 
              variant="contained" 
              sx={{ bgcolor: '#d32f2f' }}
            >
              {t('admin.save') || 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
} 