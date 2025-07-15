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
  Select,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import { Add, Edit, Delete, ArrowDropDown } from '@mui/icons-material';
import { adminService } from '../../services/adminService';
import { ROLE } from '../../constants/enums';

export default function Users() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    address: '',
    role: ROLE.DONOR,
    password: ''
  });
  const [roleFilter, setRoleFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);

  // Load users data
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (user = null) => {
    setEditUser(user);
    if (user) {
      setForm({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        dob: user.dob || '',
        address: user.address || '',
        role: user.role || ROLE.DONOR,
        password: ''
      });
    } else {
      setForm({
        fullName: '',
        email: '',
        phone: '',
        dob: '',
        address: '',
        role: ROLE.DONOR,
        password: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditUser(null);
    setForm({
      fullName: '',
      email: '',
      phone: '',
      dob: '',
      address: '',
      role: ROLE.DONOR,
      password: ''
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (editUser) {
        // Update existing user (without password)
        const { password, ...updateData } = form;
        await adminService.updateUser(editUser.id, updateData);
        setUsers(users.map(u => u.id === editUser.id ? { ...u, ...updateData } : u));
      } else {
        // Create new user with password
        const newUser = await adminService.createUser(form);
        setUsers([...users, newUser]);
      }
      handleClose();
    } catch (err) {
      setError(err.message || 'Failed to save user');
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminService.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete user');
    }
  };

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

  const getRoleColor = (role) => {
    switch (role) {
      case ROLE.ADMIN:
        return 'error';
      case ROLE.STAFF:
        return 'warning';
      case ROLE.MEDICAL_CENTER:
        return 'info';
      case ROLE.DONOR:
        return 'default';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#fff5f5', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mb: 4, color: '#d32f2f', fontWeight: 700 }}>
          {t('admin.userManagement') || 'User Management'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Card>
          <CardContent>
            <Button 
              variant="contained" 
              startIcon={<Add />} 
              sx={{ mb: 3, bgcolor: '#d32f2f' }} 
              onClick={() => handleOpen()}
            >
              {t('admin.addUser') || 'Add User'}
            </Button>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {t('admin.name') || 'Name'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {t('admin.email') || 'Email'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {t('admin.phone') || 'Phone'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      <Button onClick={handleMenuOpen} endIcon={<ArrowDropDown />} sx={{ color: '#d32f2f', fontWeight: 600 }}>
                        {t('admin.role') || 'Role'}
                      </Button>
                      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        <MenuItem selected={roleFilter === 'all'} onClick={() => handleRoleFilter('all')}>
                          {t('admin.all') || 'All'}
                        </MenuItem>
                        <MenuItem selected={roleFilter === ROLE.ADMIN} onClick={() => handleRoleFilter(ROLE.ADMIN)}>
                          {t('admin.admin') || 'Admin'}
                        </MenuItem>
                        <MenuItem selected={roleFilter === ROLE.STAFF} onClick={() => handleRoleFilter(ROLE.STAFF)}>
                          {t('admin.staff') || 'Staff'}
                        </MenuItem>
                        <MenuItem selected={roleFilter === ROLE.MEDICAL_CENTER} onClick={() => handleRoleFilter(ROLE.MEDICAL_CENTER)}>
                          {t('admin.medicalCenter') || 'Medical Center'}
                        </MenuItem>
                        <MenuItem selected={roleFilter === ROLE.DONOR} onClick={() => handleRoleFilter(ROLE.DONOR)}>
                          {t('admin.donor') || 'Donor'}
                        </MenuItem>
                      </Menu>
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      {t('admin.actions') || 'Actions'}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell sx={{ fontWeight: 'medium' }}>
                        {user.fullName}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>
                        <Chip 
                          label={t(`admin.role_${user.role.toLowerCase()}`) || user.role} 
                          color={getRoleColor(user.role)} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton 
                          onClick={() => handleOpen(user)}
                          sx={{ color: '#d32f2f' }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          onClick={() => handleDelete(user.id)}
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

        {/* Add/Edit User Dialog */}
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>
            {editUser ? t('admin.editUser') || 'Edit User' : t('admin.addUser') || 'Add User'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label={t('admin.fullName') || 'Full Name'}
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label={t('admin.email') || 'Email'}
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label={t('admin.phone') || 'Phone'}
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label={t('admin.dob') || 'Date of Birth'}
                  name="dob"
                  type="date"
                  value={form.dob}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  label={t('admin.address') || 'Address'}
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="dense">
                  <InputLabel>{t('admin.role') || 'Role'}</InputLabel>
                  <Select
                    label={t('admin.role') || 'Role'}
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                  >
                    <MenuItem value={ROLE.ADMIN}>{t('admin.admin') || 'Admin'}</MenuItem>
                    <MenuItem value={ROLE.STAFF}>{t('admin.staff') || 'Staff'}</MenuItem>
                    <MenuItem value={ROLE.MEDICAL_CENTER}>{t('admin.medicalCenter') || 'Medical Center'}</MenuItem>
                    <MenuItem value={ROLE.DONOR}>{t('admin.donor') || 'Donor'}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {!editUser && (
                <Grid item xs={12} sm={6}>
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
                </Grid>
              )}
            </Grid>
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
              {editUser ? t('admin.save') || 'Save' : t('admin.add') || 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
} 