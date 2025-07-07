import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Container, Typography, Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

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
        <Typography variant="h4" sx={{ mb: 4, color: '#d32f2f', fontWeight: 700 }}>{t('staff.inventoryManagement')}</Typography>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Button variant="contained" startIcon={<Add />} sx={{ mb: 2, bgcolor: '#d32f2f' }} onClick={() => handleOpen()}>
              {t('staff.addBloodType')}
            </Button>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('staff.bloodType')}</TableCell>
                    <TableCell>{t('staff.units')}</TableCell>
                    <TableCell align="right">{t('staff.actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.bloodType}</TableCell>
                      <TableCell>{item.units}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleOpen(item)}><Edit /></IconButton>
                        <IconButton color="error" onClick={() => handleDelete(item.id)}><Delete /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editItem ? t('staff.editBloodType') : t('staff.addBloodType')}</DialogTitle>
          <DialogContent>
            <TextField margin="dense" label={t('staff.bloodType')} name="bloodType" value={form.bloodType} onChange={handleChange} fullWidth />
            <TextField margin="dense" label={t('staff.units')} name="units" value={form.units} onChange={handleChange} fullWidth type="number" />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>{t('staff.cancel')}</Button>
            <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#d32f2f' }}>{editItem ? t('staff.save') : t('staff.add')}</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
} 