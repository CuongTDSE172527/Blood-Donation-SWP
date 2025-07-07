import { useTranslation } from 'react-i18next';
import { Button, IconButton, Tooltip, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import TranslateIcon from '@mui/icons-material/Translate';
import i18n from '../i18n';

const LanguageSwitcher = ({ open = true }) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    window.localStorage.setItem('i18nextLng', lng);
    handleClose();
  };

  return (
    <>
      {open ? (
        <Button
          color="inherit"
          startIcon={<TranslateIcon sx={{ color: '#d32f2f', fontSize: 22 }} />}
          onClick={handleClick}
          sx={{ fontWeight: 600, fontSize: 18, textTransform: 'none', color: '#d32f2f', minWidth: 0, px: 2 }}
        >
          {t('common.language')}
        </Button>
      ) : (
        <Tooltip title={t('common.language')} placement="right">
          <IconButton onClick={handleClick} sx={{ color: '#d32f2f' }}>
            <TranslateIcon sx={{ fontSize: 28 }} />
          </IconButton>
        </Tooltip>
      )}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => changeLanguage('en')}>English</MenuItem>
        <MenuItem onClick={() => changeLanguage('vi')}>Tiếng Việt</MenuItem>
      </Menu>
    </>
  );
};

export default LanguageSwitcher; 