import { useState } from 'react';
import { Box, Container, Typography, Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

const mockUsers = [
  { id: 1, name: 'Admin User', email: 'admin@test.com', role: 'admin' },
  { id: 2, name: 'Staff User', email: 'staff@test.com', role: 'staff' },
  { id: 3, name: 'Regular User', email: 'user@test.com', role: 'user' },
];

export default function Users() {
  const [users, setUsers] = useState(mockUsers);
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'user' });

  const handleOpen = (user = null) => {
    setEditUser(user);
    setForm(user ? { ...user } : { name: '', email: '', role: 'user' });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSave = () => {
    if (editUser) {
      setUsers(users.map(u => u.id === editUser.id ? { ...form, id: editUser.id } : u));
    } else {
      setUsers([...users, { ...form, id: users.length + 1 }]);
    }
    handleClose();
  };
  const handleDelete = (id) => setUsers(users.filter(u => u.id !== id));

  return (
    <Box sx={{ bgcolor: '#fff5f5', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ mb: 4, color: '#d32f2f', fontWeight: 700 }}>User Management</Typography>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Button variant="contained" startIcon={<Add />} sx={{ mb: 2, bgcolor: '#d32f2f' }} onClick={() => handleOpen()}>
              Add User
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
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip label={user.role} color={user.role === 'admin' ? 'error' : user.role === 'staff' ? 'warning' : 'default'} size="small" />
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
          <DialogTitle>{editUser ? 'Edit User' : 'Add User'}</DialogTitle>
          <DialogContent>
            <TextField margin="dense" label="Name" name="name" value={form.name} onChange={handleChange} fullWidth />
            <TextField margin="dense" label="Email" name="email" value={form.email} onChange={handleChange} fullWidth />
            <TextField margin="dense" label="Role" name="role" value={form.role} onChange={handleChange} fullWidth />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#d32f2f' }}>{editUser ? 'Save' : 'Add'}</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
} 