import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
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
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField,
  Alert,
  CircularProgress,
  Button
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { staffService } from '../../services/staffService';
import { BLOOD_TYPES } from '../../constants/enums';

export default function Inventory() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ bloodType: '', quantity: 0 });

  // Load inventory data
  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const data = await staffService.getBloodInventory();
      setInventory(data);
    } catch (err) {
      setError(err.message || 'Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (item = null) => {
    setEditItem(item);
    setForm(item ? { bloodType: item.bloodType, quantity: item.quantity } : { bloodType: '', quantity: 0 });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditItem(null);
    setForm({ bloodType: '', quantity: 0 });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'quantity') {
      setForm({ ...form, [name]: Math.max(0, parseInt(value) || 0) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSave = async () => {
    try {
      if (editItem) {
        // Update existing inventory item
        await staffService.updateBloodInventory(editItem.id, { quantity: form.quantity });
        setInventory(inventory.map(item => 
          item.id === editItem.id 
            ? { ...item, quantity: form.quantity }
            : item
        ));
      }
      handleClose();
    } catch (err) {
      setError(err.message || 'Failed to update inventory');
    }
  };

  // Initialize inventory with all blood types if empty
  useEffect(() => {
    if (inventory.length === 0 && !loading) {
      const allBloodTypes = BLOOD_TYPES.map(bloodType => ({
        id: bloodType,
        bloodType,
        quantity: 0
      }));
      setInventory(allBloodTypes);
    }
  }, [inventory.length, loading]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#fff5f5', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ mb: 4, color: '#d32f2f', fontWeight: 700 }}>
          {t('staff.inventoryManagement') || 'Blood Inventory Management'}
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, color: '#d32f2f' }}>
              {t('staff.allBloodTypes') || 'All Blood Types'}
            </Typography>
            
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {t('staff.bloodType') || 'Blood Type'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {t('staff.quantity') || 'Quantity'}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      {t('staff.actions') || 'Actions'}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell sx={{ fontWeight: 'medium' }}>
                        {item.bloodType}
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontWeight: 'bold',
                            color: item.quantity > 0 ? 'success.main' : 'error.main'
                          }}
                        >
                          {item.quantity} units
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton 
                          onClick={() => handleOpen(item)}
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

        {/* Edit Dialog */}
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            {t('staff.editBloodQuantity') || 'Edit Blood Quantity'}
          </DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label={t('staff.bloodType') || 'Blood Type'}
              name="bloodType"
              value={form.bloodType}
              fullWidth
              disabled
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label={t('staff.quantity') || 'Quantity'}
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleChange}
              fullWidth
              inputProps={{ min: 0 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>
              {t('staff.cancel') || 'Cancel'}
            </Button>
            <Button 
              onClick={handleSave} 
              variant="contained" 
              sx={{ bgcolor: '#d32f2f' }}
            >
              {t('staff.save') || 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
} 