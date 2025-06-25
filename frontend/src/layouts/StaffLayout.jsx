import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Avatar,
  Divider,
  Tooltip,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Group as GroupIcon,
  Assignment as AssignmentIcon,
  Warning as WarningIcon,
  Inventory as InventoryIcon,
  ChevronLeft as ChevronLeftIcon,
  AccessTime as AccessTimeIcon,
  CalendarToday as CalendarTodayIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { logout } from '../store/slices/authSlice';
import LanguageSwitcher from '../components/LanguageSwitcher';

const drawerWidth = 240;

function ClockCalendar() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CalendarTodayIcon fontSize="small" sx={{ color: '#d32f2f' }} />
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {now.toLocaleDateString()}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AccessTimeIcon fontSize="small" sx={{ color: '#d32f2f' }} />
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </Typography>
      </Box>
    </Box>
  );
}

const StaffLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  const navLinks = [
    { text: t('nav.summary'), icon: <DashboardIcon />, path: '/staff/dashboard' },
    { text: t('staff.donorManagement'), icon: <GroupIcon />, path: '/staff/donors' },
    { text: t('staff.requestManagement'), icon: <AssignmentIcon />, path: '/staff/requests' },
    { text: t('staff.emergency'), icon: <WarningIcon />, path: '/staff/emergency' },
    { text: t('staff.inventory'), icon: <InventoryIcon />, path: '/staff/inventory' },
  ];

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleProfileClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    dispatch(logout());
    handleProfileClose();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#fff5f5' }}>
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : 64,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 64,
            boxSizing: 'border-box',
            bgcolor: '#fff',
            borderRight: '1px solid #eee',
            transition: 'width 0.2s',
            overflowX: 'hidden',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: open ? 'space-between' : 'center', px: 2, py: 2 }}>
          {open && (
            <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 700 }}>
              Staff
            </Typography>
          )}
          <IconButton onClick={() => setOpen((v) => !v)}>
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        </Box>
        <Divider />
        <Box sx={{ px: open ? 2 : 0, pt: 2 }}>
          <ClockCalendar />
        </Box>
        <List>
          {navLinks.map((item) => (
            <Tooltip key={item.text} title={!open ? item.text : ''} placement="right">
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  color: location.pathname === item.path ? '#d32f2f' : 'inherit',
                }}
              >
                <ListItemIcon sx={{ color: location.pathname === item.path ? '#d32f2f' : '#888', minWidth: 0, mr: open ? 2 : 'auto', justifyContent: 'center' }}>
                  {item.icon}
                </ListItemIcon>
                {open && <ListItemText primary={item.text} />}
              </ListItemButton>
            </Tooltip>
          ))}
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ px: open ? 2 : 0, pb: 2, display: 'flex', flexDirection: 'column', alignItems: open ? 'flex-start' : 'center', gap: 2 }}>
          <LanguageSwitcher />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <IconButton onClick={handleProfileClick} sx={{ p: 0 }}>
              <Avatar alt={user?.name} src={user?.avatar} sx={{ width: 40, height: 40, bgcolor: '#d32f2f' }} />
            </IconButton>
            {open && (
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#d32f2f', cursor: 'pointer' }} onClick={handleProfileClick}>
                {user?.name}
              </Typography>
            )}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleProfileClose}>
              <MenuItem onClick={handleLogout}>{t('nav.logout')}</MenuItem>
            </Menu>
          </Box>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 4, minHeight: '100vh', bgcolor: '#fff5f5' }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default StaffLayout; 