import { useEffect, useState } from 'react';
import { Box, Container, Typography, Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { adminService } from '../../services/adminService';

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [open, setOpen] = useState(false);
  const [editStaff, setEditStaff] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'staff' });

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const data = await adminService.getStaffs();
        setStaff(data);
      } catch (err) {
        // Có thể set error nếu muốn
      }
    };
    fetchStaff();
  }, []);

  const handleOpen = (user = null) => {
    setEditStaff(user);
    setForm(user ? { ...user } : { name: '', email: '', role: 'staff' });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSave = () => {
    if (editStaff) {
      setStaff(staff.map(u => u.id === editStaff.id ? { ...form, id: editStaff.id } : u));
    } else {
      setStaff([...staff, { ...form, id: staff.length + 1 }]);
    }
    handleClose();
  };
  const handleDelete = (id) => setStaff(staff.filter(u => u.id !== id));

  return (
    <Box sx={{ bgcolor: '#fff5f5', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ mb: 4, color: '#d32f2f', fontWeight: 700 }}>Medical Center Management</Typography>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Button variant="contained" startIcon={<Add />} sx={{ mb: 2, bgcolor: '#d32f2f' }} onClick={() => handleOpen()}>
              Add Medical Center
            </Button>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {staff.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip label={user.role} color="warning" size="small" />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleOpen(user)}><Edit /></IconButton>
                        <IconButton color="error" onClick={() => handleDelete(user.id)}><Delete /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editStaff ? 'Edit Medical Center' : 'Add Medical Center'}</DialogTitle>
          <DialogContent>
            <TextField margin="dense" label="Name" name="name" value={form.name} onChange={handleChange} fullWidth />
            <TextField margin="dense" label="Email" name="email" value={form.email} onChange={handleChange} fullWidth />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#d32f2f' }}>{editStaff ? 'Save' : 'Add'}</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
} 