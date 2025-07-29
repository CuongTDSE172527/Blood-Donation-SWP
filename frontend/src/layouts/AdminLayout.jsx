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
  People as PeopleIcon,
  Inventory as InventoryIcon,
  Settings as SettingsIcon,
  Group as GroupIcon,
  ChevronLeft as ChevronLeftIcon,
  AccessTime as AccessTimeIcon,
  CalendarToday as CalendarTodayIcon,
  LocalHospital as LocalHospitalIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { logout } from '../store/slices/authSlice';
import LanguageSwitcher from '../components/LanguageSwitcher';

const drawerWidth = 240;
const sidebarGradient = 'linear-gradient(180deg, #fff5f5 0%, #ffe0e0 100%)';
const sidebarActive = {
  background: 'linear-gradient(90deg, #d32f2f 60%, #ff7961 100%)',
  color: '#fff',
  boxShadow: '0 4px 16px 0 rgba(211,47,47,0.10)',
  borderRadius: 2,
  transform: 'scale(1.04)',
};
const sidebarHover = {
  background: 'linear-gradient(90deg, #ffebee 60%, #fff 100%)',
  color: '#d32f2f',
  borderRadius: 2,
  transition: 'all 0.2s',
};
const avatarBorder = {
  border: '3px solid #d32f2f',
  boxShadow: '0 2px 8px 0 rgba(211,47,47,0.10)',
};
const menuPaper = {
  borderRadius: 3,
  boxShadow: '0 8px 32px 0 rgba(211,47,47,0.10)',
  background: 'rgba(255,255,255,0.95)',
  backdropFilter: 'blur(8px)',
  minWidth: 180,
  p: 1,
  animation: 'fadeInMenu 0.3s',
};

function ClockCalendar({ open }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  if (!open) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2, gap: 1 }}>
        <Tooltip title={now.toLocaleDateString()} placement="right">
          <CalendarTodayIcon fontSize="medium" sx={{ color: '#d32f2f' }} />
        </Tooltip>
        <Tooltip title={now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} placement="right">
          <AccessTimeIcon fontSize="medium" sx={{ color: '#d32f2f' }} />
        </Tooltip>
      </Box>
    );
  }
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

const AdminLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  const navLinks = [
    { text: t('nav.summary'), icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: t('admin.userManagement'), icon: <PeopleIcon />, path: '/admin/users' },
    { text: t('admin.requestManagement') || 'Requests', icon: <InventoryIcon />, path: '/admin/requests' },
    { text: t('admin.inventory'), icon: <InventoryIcon />, path: '/admin/inventory' },
    { text: t('admin.medicalCenters') || 'Medical Centers', icon: <LocalHospitalIcon />, path: '/admin/medical-center' },
    { text: t('admin.scheduleManagement') || 'Schedule Management', icon: <ScheduleIcon />, path: '/admin/schedule' },
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
      <style>{`
        @keyframes fadeInMenu { from { opacity: 0; transform: translateY(16px);} to { opacity: 1; transform: none; } }
      `}</style>
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : 64,
          flexShrink: 0,
          '& .MuiDrawer-paper': glassSidebar(open),
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: open ? 'space-between' : 'center', px: 2, py: 2 }}>
          {open && (
            <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 700, letterSpacing: 1 }}>
              Admin
            </Typography>
          )}
          <IconButton onClick={() => setOpen((v) => !v)}>
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        </Box>
        <Divider />
        <Box sx={{ px: open ? 2 : 0, pt: 2 }}>
          <ClockCalendar open={open} />
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
                  color: location.pathname === item.path ? '#fff' : '#d32f2f',
                  fontWeight: location.pathname === item.path ? 700 : 500,
                  fontSize: 17,
                  mb: 1,
                  ...(location.pathname === item.path ? sidebarActive : {}),
                  '&:hover': sidebarHover,
                  transition: 'all 0.2s',
                }}
              >
                <ListItemIcon sx={{ color: location.pathname === item.path ? '#fff' : '#d32f2f', minWidth: 0, mr: open ? 2 : 'auto', justifyContent: 'center', fontSize: 24 }}>
                  {item.icon}
                </ListItemIcon>
                {open && <ListItemText primary={item.text} />}
              </ListItemButton>
            </Tooltip>
          ))}
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ px: open ? 2 : 0, pb: 2, display: 'flex', flexDirection: 'column', alignItems: open ? 'flex-start' : 'center', gap: 2 }}>
          <LanguageSwitcher open={open} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <IconButton onClick={handleProfileClick} sx={{ p: 0 }}>
              <Avatar alt={user?.name} src={user?.avatar} sx={{ width: 44, height: 44, bgcolor: '#fff', color: '#d32f2f', ...avatarBorder }} />
            </IconButton>
            {open && (
              <Typography variant="body1" sx={{ fontWeight: 700, color: '#d32f2f', cursor: 'pointer', ml: 1 }} onClick={handleProfileClick}>
                {user?.name}
              </Typography>
            )}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleProfileClose}
              PaperProps={{ sx: glassMenuPaper }}
              MenuListProps={{ sx: { p: 0 } }}
            >
              <MenuItem onClick={() => { navigate('/'); handleProfileClose(); }} sx={{ fontWeight: 600, fontSize: 17, py: 1.5, px: 2, borderRadius: 2, '&:hover': { bgcolor: '#fff5f5', color: '#d32f2f' } }}>
                {t('nav.home') || 'Home'}
              </MenuItem>
              <MenuItem onClick={() => { navigate('/medical-center'); handleProfileClose(); }} sx={{ fontWeight: 600, fontSize: 17, py: 1.5, px: 2, borderRadius: 2, '&:hover': { bgcolor: '#fff5f5', color: '#d32f2f' } }}>
                {t('nav.medicalCenter') || 'Medical Center'}
              </MenuItem>
              <MenuItem onClick={() => { navigate('/admin/profile'); handleProfileClose(); }} sx={{ fontWeight: 600, fontSize: 17, py: 1.5, px: 2, borderRadius: 2, '&:hover': { bgcolor: '#fff5f5', color: '#d32f2f' } }}>
                {t('admin.editProfile') || 'Edit Profile'}
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ fontWeight: 700, fontSize: 17, py: 1.5, px: 2, borderRadius: 2, color: '#d32f2f', '&:hover': { bgcolor: '#ffebee', color: '#b71c1c' } }}>
                {t('nav.logout')}
              </MenuItem>
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

export default AdminLayout; 