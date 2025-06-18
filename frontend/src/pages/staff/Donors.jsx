import { useState } from 'react';
import { Box, Container, Typography, Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

const mockDonors = [
  { id: 1, name: 'John Doe', bloodType: 'A+', lastDonation: '2024-02-15', status: 'Eligible' },
  { id: 2, name: 'Jane Smith', bloodType: 'O-', lastDonation: '2024-01-20', status: 'Eligible' },
  { id: 3, name: 'Mike Johnson', bloodType: 'B+', lastDonation: '2023-12-10', status: 'Not Eligible' },
];

export default function Donors() {
  const [donors, setDonors] = useState(mockDonors);
  const [open, setOpen] = useState(false);
  const [editDonor, setEditDonor] = useState(null);
  const [form, setForm] = useState({ name: '', bloodType: '', lastDonation: '', status: 'Eligible' });

  const handleOpen = (donor = null) => {
    setEditDonor(donor);
    setForm(donor ? { ...donor } : { name: '', bloodType: '', lastDonation: '', status: 'Eligible' });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSave = () => {
    if (editDonor) {
      setDonors(donors.map(d => d.id === editDonor.id ? { ...form, id: editDonor.id } : d));
    } else {
      setDonors([...donors, { ...form, id: donors.length + 1 }]);
    }
    handleClose();
  };
  const handleDelete = (id) => setDonors(donors.filter(d => d.id !== id));

  return (
    <Box sx={{ bgcolor: '#fff5f5', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ mb: 4, color: '#d32f2f', fontWeight: 700 }}>Donor Management</Typography>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Button variant="contained" startIcon={<Add />} sx={{ mb: 2, bgcolor: '#d32f2f' }} onClick={() => handleOpen()}>
              Add Donor
            </Button>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Blood Type</TableCell>
                    <TableCell>Last Donation</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {donors.map((donor) => (
                    <TableRow key={donor.id}>
                      <TableCell>{donor.name}</TableCell>
                      <TableCell>{donor.bloodType}</TableCell>
                      <TableCell>{donor.lastDonation}</TableCell>
                      <TableCell>
                        <Chip label={donor.status} color={donor.status === 'Eligible' ? 'success' : 'error'} size="small" />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleOpen(donor)}><Edit /></IconButton>
                        <IconButton color="error" onClick={() => handleDelete(donor.id)}><Delete /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editDonor ? 'Edit Donor' : 'Add Donor'}</DialogTitle>
          <DialogContent>
            <TextField margin="dense" label="Name" name="name" value={form.name} onChange={handleChange} fullWidth />
            <TextField margin="dense" label="Blood Type" name="bloodType" value={form.bloodType} onChange={handleChange} fullWidth />
            <TextField margin="dense" label="Last Donation" name="lastDonation" value={form.lastDonation} onChange={handleChange} fullWidth />
            <TextField margin="dense" label="Status" name="status" value={form.status} onChange={handleChange} fullWidth />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#d32f2f' }}>{editDonor ? 'Save' : 'Add'}</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
} 