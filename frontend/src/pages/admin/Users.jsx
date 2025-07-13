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
  Chip, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Menu, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select 
} from '@mui/material';
import { Add, Edit, Delete, ArrowDropDown } from '@mui/icons-material';

const mockUsers = [
  { id: 1, name: 'Admin User', email: 'admin@test.com', role: 'admin' },
  { id: 2, name: 'Staff User', email: 'staff@test.com', role: 'staff' },
  { id: 3, name: 'Donor User', email: 'donor@test.com', role: 'donor' },
];

export default function Users() {
  const { t } = useTranslation();
  const [users, setUsers] = useState(mockUsers);
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'donor', password: '' });
  const [roleFilter, setRoleFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (user = null) => {
    setEditUser(user);
    setForm(user ? { ...user, password: '' } : { name: '', email: '', role: 'donor', password: '' });
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

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleRoleFilter = (role) => {
    setRoleFilter(role);
    handleMenuClose();
  };

  const filteredUsers = roleFilter === 'all' ? users : users.filter(u => u.role === roleFilter);

  return (
    <Box sx={{ bgcolor: '#fff5f5', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ mb: 4, color: '#d32f2f', fontWeight: 700 }}>{t('admin.userManagement')}</Typography>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Button variant="contained" startIcon={<Add />} sx={{ mb: 2, bgcolor: '#d32f2f' }} onClick={() => handleOpen()}>
              {t('admin.addUser')}
            </Button>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('admin.name')}</TableCell>
                    <TableCell>{t('admin.email')}</TableCell>
                    <TableCell>
                      <Button onClick={handleMenuOpen} endIcon={<ArrowDropDown />} sx={{ color: '#d32f2f', fontWeight: 600 }}>
                        {t('admin.role')}
                      </Button>
                      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        <MenuItem selected={roleFilter === 'all'} onClick={() => handleRoleFilter('all')}>{t('admin.all')}</MenuItem>
                        <MenuItem selected={roleFilter === 'admin'} onClick={() => handleRoleFilter('admin')}>{t('admin.admin')}</MenuItem>
                        <MenuItem selected={roleFilter === 'staff'} onClick={() => handleRoleFilter('staff')}>{t('admin.staff')}</MenuItem>
                        <MenuItem selected={roleFilter === 'donor'} onClick={() => handleRoleFilter('donor')}>{t('admin.donor')}</MenuItem>
                      </Menu>
                    </TableCell>
                    <TableCell align="right">{t('admin.actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip label={t('admin.role_' + user.role)} color={user.role === 'admin' ? 'error' : user.role === 'staff' ? 'warning' : 'default'} size="small" />
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
          <DialogTitle>{editUser ? t('admin.editUser') : t('admin.addUser')}</DialogTitle>
          <DialogContent>
            <TextField margin="dense" label={t('admin.name')} name="name" value={form.name} onChange={handleChange} fullWidth />
            <TextField margin="dense" label={t('admin.email')} name="email" value={form.email} onChange={handleChange} fullWidth />
            <FormControl fullWidth margin="dense">
              <InputLabel>{t('admin.role')}</InputLabel>
              <Select
                label={t('admin.role')}
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <MenuItem value="admin">{t('admin.admin')}</MenuItem>
                <MenuItem value="staff">{t('admin.staff')}</MenuItem>
                <MenuItem value="donor">{t('admin.donor')}</MenuItem>
              </Select>
            </FormControl>
            {!editUser && (
              <TextField 
                margin="dense" 
                label={t('admin.password') || 'Password'} 
                name="password" 
                type="password" 
                value={form.password} 
                onChange={handleChange} 
                fullWidth 
                required
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>{t('admin.cancel')}</Button>
            <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#d32f2f' }}>{editUser ? t('admin.save') : t('admin.add')}</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
} 