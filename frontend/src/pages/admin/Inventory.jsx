import { useState } from 'react';
import { Box, Container, Typography, Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

const mockInventory = [
  { id: 1, bloodType: 'A+', units: 25 },
  { id: 2, bloodType: 'O-', units: 15 },
  { id: 3, bloodType: 'B+', units: 30 },
];

export default function Inventory() {
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
        <Typography variant="h4" sx={{ mb: 4, color: '#d32f2f', fontWeight: 700 }}>Inventory Management</Typography>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Button variant="contained" startIcon={<Add />} sx={{ mb: 2, bgcolor: '#d32f2f' }} onClick={() => handleOpen()}>
              Add Blood Type
            </Button>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Blood Type</TableCell>
                    <TableCell>Units</TableCell>
                    <TableCell align="right">Actions</TableCell>
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
          <DialogTitle>{editItem ? 'Edit Blood Type' : 'Add Blood Type'}</DialogTitle>
          <DialogContent>
            <TextField margin="dense" label="Blood Type" name="bloodType" value={form.bloodType} onChange={handleChange} fullWidth />
            <TextField margin="dense" label="Units" name="units" value={form.units} onChange={handleChange} fullWidth type="number" />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#d32f2f' }}>{editItem ? 'Save' : 'Add'}</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
} 