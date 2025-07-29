/**
 * LanguageSwitcher Component - Component chuyển đổi ngôn ngữ
 * 
 * LUỒNG CHẠY CỦA LANGUAGE SWITCHER:
 * 1. Component render với ngôn ngữ hiện tại từ i18n
 * 2. User click vào language switcher → mở dropdown menu
 * 3. User chọn ngôn ngữ mới → gọi changeLanguage()
 * 4. i18n.changeLanguage() cập nhật ngôn ngữ toàn cục
 * 5. Lưu ngôn ngữ vào localStorage để persist
 * 6. Tất cả components tự động re-render với ngôn ngữ mới
 */

import { useTranslation } from 'react-i18next'; // Hook để sử dụng translation
import { Button, IconButton, Tooltip, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import TranslateIcon from '@mui/icons-material/Translate'; // Icon cho language switcher
import i18n from '../i18n'; // i18n instance để thay đổi ngôn ngữ

/**
 * LanguageSwitcher Component
 * @param {boolean} open - Có hiển thị text hay chỉ icon (true = hiển thị text, false = chỉ icon)
 * 
 * LUỒNG XỬ LÝ:
 * 1. Sử dụng useTranslation hook để lấy translation function
 * 2. Quản lý state cho dropdown menu (anchorEl)
 * 3. Xử lý click events để mở/đóng menu
 * 4. Xử lý thay đổi ngôn ngữ và persist vào localStorage
 */
const LanguageSwitcher = ({ open = true }) => {
  const { t } = useTranslation(); // Hook để translate text
  const [anchorEl, setAnchorEl] = useState(null); // State cho dropdown menu position

  /**
   * Handle click event - Mở dropdown menu
   * @param {Event} event - Click event
   */
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // Lưu element được click để position menu
  };

  /**
   * Handle close event - Đóng dropdown menu
   */
  const handleClose = () => {
    setAnchorEl(null); // Reset anchor element để đóng menu
  };

  /**
   * Change language function - Thay đổi ngôn ngữ
   * @param {string} lng - Language code ('en' hoặc 'vi')
   * 
   * LUỒNG XỬ LÝ:
   * 1. Gọi i18n.changeLanguage() để thay đổi ngôn ngữ toàn cục
   * 2. Lưu ngôn ngữ vào localStorage để persist qua sessions
   * 3. Đóng dropdown menu
   * 4. Tất cả components sử dụng useTranslation sẽ tự động re-render
   */
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng); // Thay đổi ngôn ngữ toàn cục
    window.localStorage.setItem('i18nextLng', lng); // Lưu vào localStorage để persist
    handleClose(); // Đóng dropdown menu
  };

  return (
    <>
      {/* === LANGUAGE SWITCHER BUTTON === */}
      {open ? (
        // Hiển thị button với text và icon
        <Button
          color="inherit"
          startIcon={<TranslateIcon sx={{ color: '#d32f2f', fontSize: 22 }} />} // Icon translate
          onClick={handleClick} // Mở dropdown menu khi click
          sx={{ fontWeight: 600, fontSize: 18, textTransform: 'none', color: '#d32f2f', minWidth: 0, px: 2 }}
        >
          {t('common.language')} {/* Hiển thị text "Language" hoặc "Ngôn ngữ" */}
        </Button>
      ) : (
        // Hiển thị chỉ icon với tooltip
        <Tooltip title={t('common.language')} placement="right"> {/* Tooltip khi hover */}
          <IconButton onClick={handleClick} sx={{ color: '#d32f2f' }}>
            <TranslateIcon sx={{ fontSize: 28 }} />
          </IconButton>
        </Tooltip>
      )}
      
      {/* === LANGUAGE SELECTION MENU === */}
      <Menu
        anchorEl={anchorEl} // Element để position menu
        open={Boolean(anchorEl)} // Mở menu khi có anchorEl
        onClose={handleClose} // Đóng menu khi click outside
      >
        {/* English option */}
        <MenuItem onClick={() => changeLanguage('en')}>
          English
        </MenuItem>
        {/* Vietnamese option */}
        <MenuItem onClick={() => changeLanguage('vi')}>
          Tiếng Việt
        </MenuItem>
      </Menu>
    </>
  );
};

export default LanguageSwitcher; 