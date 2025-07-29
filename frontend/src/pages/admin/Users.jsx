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
import { Add, Edit, Delete, ArrowDropDown, Search, FilterList } from '@mui/icons-material';
import { adminService } from '../../services/adminService';
import { ROLE } from '../../constants/enums';

export default function Users() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
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
    role: 'DONOR',
    password: ''
  });
  const [roleFilter, setRoleFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Load users data
  useEffect(() => {
    loadUsers();
  }, []);

  // Filter and sort users when data changes
  useEffect(() => {
    filterAndSortUsers();
  }, [users, searchTerm, roleFilter, sortBy, sortOrder]);

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

  const filterAndSortUsers = () => {
    // Filter out medical center accounts from general user management
    let filtered = users.filter(u => u.role !== 'MEDICALCENTER');

    // Apply role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(u => u.role === roleFilter);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(user => 
        (user.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.phone || '').includes(searchTerm) ||
        (user.id?.toString() || '').includes(searchTerm)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = (a.fullName || '').toLowerCase();
          bValue = (b.fullName || '').toLowerCase();
          break;
        case 'email':
          aValue = (a.email || '').toLowerCase();
          bValue = (b.email || '').toLowerCase();
          break;
        case 'phone':
          aValue = (a.phone || '').toLowerCase();
          bValue = (b.phone || '').toLowerCase();
          break;
        case 'role':
          aValue = (a.role || '').toLowerCase();
          bValue = (b.role || '').toLowerCase();
          break;
        case 'dob':
          aValue = new Date(a.dob || 0);
          bValue = new Date(b.dob || 0);
          break;
        default:
          aValue = a.id || 0;
          bValue = b.id || 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredUsers(filtered);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
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
        role: user.role || 'DONOR',
        password: ''
      });
    } else {
      setForm({
        fullName: '',
        email: '',
        phone: '',
        dob: '',
        address: '',
        role: 'DONOR',
        password: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditUser(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (editUser) {
        await adminService.updateUser(editUser.id, form);
        setUsers(users.map(u => u.id === editUser.id ? { ...u, ...form } : u));
      } else {
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

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'error';
      case 'STAFF':
        return 'warning';
      case 'DONOR':
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

        {/* Search and Filter Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label={t('admin.search') || 'Search users...'}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                  placeholder={t('admin.searchPlaceholder') || 'Search by name, email, phone, or ID...'}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>{t('admin.filterByRole') || 'Filter by Role'}</InputLabel>
                  <Select
                    value={roleFilter}
                    onChange={(e) => handleRoleFilter(e.target.value)}
                    label={t('admin.filterByRole') || 'Filter by Role'}
                  >
                    <MenuItem value="all">{t('admin.allRoles') || 'All Roles'}</MenuItem>
                    <MenuItem value="ADMIN">{t('admin.admin') || 'Admin'}</MenuItem>
                    <MenuItem value="STAFF">{t('admin.staff') || 'Staff'}</MenuItem>
                    <MenuItem value="DONOR">{t('admin.donor') || 'Donor'}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>{t('admin.sortBy') || 'Sort By'}</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    label={t('admin.sortBy') || 'Sort By'}
                  >
                    <MenuItem value="name">{t('admin.name') || 'Name'}</MenuItem>
                    <MenuItem value="email">{t('admin.email') || 'Email'}</MenuItem>
                    <MenuItem value="phone">{t('admin.phone') || 'Phone'}</MenuItem>
                    <MenuItem value="role">{t('admin.role') || 'Role'}</MenuItem>
                    <MenuItem value="dob">{t('admin.dob') || 'Date of Birth'}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                  startIcon={<FilterList />}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: '#d32f2f' }}>
                {t('admin.users') || 'Users'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {t('admin.showingResults') || 'Showing'} {filteredUsers.length} {t('admin.of') || 'of'} {users.filter(u => u.role !== 'MEDICALCENTER').length} {t('admin.users') || 'users'}
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<Add />} 
                  sx={{ bgcolor: '#d32f2f' }} 
                  onClick={() => handleOpen()}
                >
                  {t('admin.addUser') || 'Add User'}
                </Button>
              </Box>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('admin.name') || 'Name'}</TableCell>
                    <TableCell>{t('admin.email') || 'Email'}</TableCell>
                    <TableCell>{t('admin.phone') || 'Phone'}</TableCell>
                    <TableCell>{t('admin.role') || 'Role'}</TableCell>
                    <TableCell align="right">{t('admin.actions') || 'Actions'}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        {searchTerm || roleFilter !== 'all' 
                          ? (t('admin.noMatchingUsers') || 'No matching users found') 
                          : (t('common.noData') || 'No data')}
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.map((user) => (
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
                    <MenuItem value="ADMIN">{t('admin.admin') || 'Admin'}</MenuItem>
                    <MenuItem value="STAFF">{t('admin.staff') || 'Staff'}</MenuItem>
                    <MenuItem value="DONOR">{t('admin.donor') || 'Donor'}</MenuItem>
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