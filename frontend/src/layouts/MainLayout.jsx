import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  Info,
  LocalHospital,
  Search,
  Warning,
  Person,
  Login,
  HowToReg,
} from '@mui/icons-material';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import LanguageSwitcher from '../components/LanguageSwitcher';

const MainLayout = () => {
  const { t, i18n } = useTranslation();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
    handleCloseUserMenu();
  };

  const handleLogoutConfirm = () => {
    dispatch(logout());
    setShowLogoutDialog(false);
    setShowLogoutAlert(true);
    navigate('/');
  };

  const handleLogoutCancel = () => {
    setShowLogoutDialog(false);
  };

  const handleCloseLogoutAlert = () => {
    setShowLogoutAlert(false);
  };

  const navItems = [
    { text: t('nav.home'), icon: <Home sx={{ color: i18n.language === 'vi' ? '#d32f2f' : undefined }} />, path: '/' },
    { text: t('nav.about'), icon: <Info sx={{ color: i18n.language === 'vi' ? '#d32f2f' : undefined }} />, path: '/about' },
    { text: t('nav.bloodSchedule'), icon: <LocalHospital sx={{ color: i18n.language === 'vi' ? '#d32f2f' : undefined }} />, path: '/schedule' },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <List>
        {navItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#d32f2f' }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: '#fff', color: 'text.primary', boxShadow: 'none', borderBottom: '1px solid #eee' }}>
        <Container maxWidth="xl" disableGutters>
          <Toolbar sx={{ minHeight: 80, px: 2, justifyContent: 'space-between' }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <IconButton edge="start" color="inherit" sx={{ mr: 2 }} onClick={() => navigate('/') }>
                <BloodtypeIcon sx={{ color: 'error.main', fontSize: 36 }} />
              </IconButton>
            </Box>
            {/* Centered Navigation */}
            <Box sx={{ display: 'flex', flex: 2, justifyContent: 'center', alignItems: 'center', gap: 4 }}>
              {navItems.map((item) => (
                <Button
                  key={item.text}
                  color="inherit"
                  startIcon={item.icon}
                  onClick={() => navigate(item.path)}
                  sx={{ fontWeight: 600, fontSize: 18, textTransform: 'none', color: '#d32f2f' }}
                >
                  {item.text}
                </Button>
              ))}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LanguageSwitcher />
              </Box>
            </Box>
            {/* User Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
              {isAuthenticated ? (
                <>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 18 }}>{user?.name}</Typography>
                  <Tooltip title={t('nav.dashboard')}>
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar alt={user?.name} src={user?.avatar} />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    keepMounted
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem onClick={() => navigate(`/${user.role}/dashboard`)}>
                      <ListItemIcon>
                        <Person fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={t('nav.dashboard')} />
                    </MenuItem>
                    <MenuItem onClick={handleLogoutClick} sx={{ color: 'error.main' }}>
                      <ListItemIcon>
                        <Login fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={t('nav.logout')} />
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    startIcon={<Login sx={{ color: '#d32f2f', fontSize: 22 }} />}
                    onClick={() => navigate('/login')}
                    sx={{ fontWeight: 600, fontSize: 18, textTransform: 'none', color: '#d32f2f', minWidth: 0, px: 2 }}
                  >
                    {t('nav.login')}
                  </Button>
                  <Button
                    startIcon={<HowToReg sx={{ color: '#d32f2f', fontSize: 22 }} />}
                    onClick={() => navigate('/register')}
                    sx={{ fontWeight: 600, fontSize: 18, textTransform: 'none', color: '#d32f2f', minWidth: 0, px: 2 }}
                  >
                    {t('nav.register')}
                  </Button>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
        <Outlet />
      </Box>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={showLogoutDialog}
        onClose={handleLogoutCancel}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title">
          {t('nav.logout')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogoutConfirm} color="error" autoFocus>
            {t('nav.logout')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Logout Success Alert */}
      <Snackbar
        open={showLogoutAlert}
        autoHideDuration={3000}
        onClose={handleCloseLogoutAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseLogoutAlert} severity="success">
          Logout successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MainLayout; 