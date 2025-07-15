import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Container,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  LocalHospital as LocalHospitalIcon,
  Bloodtype as BloodtypeIcon,
  Warning as EmergencyIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import LanguageSwitcher from '../components/LanguageSwitcher';

const drawerWidth = 240;

const MedicalCenterLayout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    {
      text: t('medicalCenter.dashboard') || 'Dashboard',
      icon: <DashboardIcon />,
      path: '/medical-center/dashboard',
    },
    {
      text: t('medicalCenter.donors') || 'Donor Management',
      icon: <PeopleIcon />,
      path: '/medical-center/donors',
    },
    {
      text: t('medicalCenter.receivers') || 'Receiver Management',
      icon: <LocalHospitalIcon />,
      path: '/medical-center/receivers',
    },
    {
      text: t('medicalCenter.requests') || 'Request Management',
      icon: <BloodtypeIcon />,
      path: '/medical-center/requests',
    },
  ];

  const drawer = (
    <Box>
      <Box sx={{ p: 2, textAlign: 'center', borderBottom: '1px solid #e0e0e0' }}>
        <LocalHospitalIcon sx={{ fontSize: 40, color: '#d32f2f', mb: 1 }} />
        <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 700 }}>
          {t('medicalCenter.title') || 'Medical Center'}
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: '#fff5f5',
                  color: '#d32f2f',
                  '&:hover': {
                    backgroundColor: '#fff5f5',
                  },
                },
                '&:hover': {
                  backgroundColor: '#fff5f5',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? '#d32f2f' : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const glassSidebar = (open) => ({
    width: open ? drawerWidth : 64,
    boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.55)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRight: '1.5px solid rgba(211,47,47,0.10)',
    boxShadow: '0 8px 32px 0 rgba(211,47,47,0.12)',
    borderRadius: open ? '18px' : '6px',
    margin: open ? '12px 0 12px 12px' : '0', // bỏ margin khi minimize
    height: '100vh', // luôn vừa với màn hình
    transition: 'all 0.25s cubic-bezier(.4,2,.6,1)',
    overflowX: 'hidden',
  });
  const glassMenuPaper = {
    borderRadius: 8, // giảm bo góc
    boxShadow: '0 8px 32px 0 rgba(211,47,47,0.18)',
    background: 'rgba(255,255,255,0.85)',
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    minWidth: 200,
    p: 1,
    animation: 'fadeInMenu 0.3s',
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: '#fff',
          color: '#333',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {t('medicalCenter.title') || 'Medical Center Management'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LanguageSwitcher open={true} />
            <IconButton color="inherit">
              <NotificationsIcon />
            </IconButton>
            <IconButton
              color="inherit"
              onClick={handleMenuOpen}
            >
              <AccountCircleIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{ sx: glassMenuPaper }}
              MenuListProps={{ sx: { p: 0 } }}
            >
              <MenuItem onClick={() => { navigate('/'); handleMenuClose(); }}>
                {t('nav.home') || 'Home'}
              </MenuItem>
              <MenuItem onClick={() => navigate('/medical-center/profile')}>
                <AccountCircleIcon sx={{ mr: 1 }} />
                {t('medicalCenter.profile') || 'Profile'}
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} />
                {t('nav.logout') || 'Logout'}
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': glassSidebar(true),
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MedicalCenterLayout; 