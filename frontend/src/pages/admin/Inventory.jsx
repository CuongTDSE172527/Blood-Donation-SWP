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
import { Add, Edit, Delete } from '@mui/icons-material';
import { BLOOD_TYPES } from '../../constants/enums';

const mockInventory = [
  { id: 1, bloodType: 'A+', units: 25 },
  { id: 2, bloodType: 'O-', units: 15 },
  { id: 3, bloodType: 'B+', units: 30 },
];

export default function Inventory() {
  const { t } = useTranslation();
  const [inventory, setInventory] = useState(mockInventory);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ bloodType: '', units: 0 });

  const handleOpen = (item = null) => {
    setEditItem(item);
    setForm(item ? { ...item } : { bloodType: '', units: 0 });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSave = () => {
    if (editItem) {
      setInventory(inventory.map(i => i.id === editItem.id ? { ...form, id: editItem.id } : i));
    } else {
      setInventory([...inventory, { ...form, id: inventory.length + 1 }]);
    }
    handleClose();
  };
  const handleDelete = (id) => setInventory(inventory.filter(i => i.id !== id));

  return (
    <Box sx={{ bgcolor: '#fff5f5', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ mb: 4, color: '#d32f2f', fontWeight: 700 }}>
          {t('admin.inventoryManagement') || 'Blood Inventory Management'}
        </Typography>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Button variant="contained" startIcon={<Add />} sx={{ mb: 2, bgcolor: '#d32f2f' }} onClick={() => handleOpen()}>
              {t('admin.addBloodType') || 'Add Blood Type'}
            </Button>
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
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      {t('admin.actions') || 'Actions'}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell sx={{ fontWeight: 'medium' }}>
                        {item.bloodType}
                      </TableCell>
                      <TableCell>{item.units}</TableCell>
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
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            {editItem ? t('admin.editBloodType') || 'Edit Blood Type' : t('admin.addBloodType') || 'Add Blood Type'}
          </DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="dense">
              <InputLabel>{t('admin.bloodType') || 'Blood Type'}</InputLabel>
              <Select
                label={t('admin.bloodType') || 'Blood Type'}
                name="bloodType"
                value={form.bloodType}
                onChange={handleChange}
              >
                {BLOOD_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField 
              margin="dense" 
              label={t('admin.units') || 'Units'} 
              name="units" 
              value={form.units} 
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
              {editItem ? t('admin.save') || 'Save' : t('admin.add') || 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
} 