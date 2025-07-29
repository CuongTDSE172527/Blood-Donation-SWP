/**
 * i18n Configuration - Cấu hình hệ thống đa ngôn ngữ (Internationalization)
 * 
 * LUỒNG CHẠY CỦA HỆ THỐNG DỊCH NGÔN NGỮ:
 * 1. App khởi động → i18n.js được import → khởi tạo i18n instance
 * 2. LanguageDetector tự động phát hiện ngôn ngữ từ browser
 * 3. Load translation files (en.json, vi.json) vào resources
 * 4. Components sử dụng useTranslation hook để lấy text
 * 5. LanguageSwitcher cho phép user thay đổi ngôn ngữ
 * 6. Ngôn ngữ được lưu vào localStorage để persist
 */

import i18n from 'i18next'; // Core i18n library
import { initReactI18next } from 'react-i18next'; // React integration
import LanguageDetector from 'i18next-browser-languagedetector'; // Auto-detect browser language

// Import translation files
import en from './translations/en.json'; // English translations
import vi from './translations/vi.json'; // Vietnamese translations

/**
 * i18n Configuration và Initialization
 * LUỒNG KHỞI TẠO:
 * 1. Sử dụng LanguageDetector để tự động phát hiện ngôn ngữ
 * 2. Khởi tạo React integration
 * 3. Cấu hình resources với translation files
 * 4. Set fallback language và interpolation options
 */
i18n
  .use(LanguageDetector) // Plugin tự động phát hiện ngôn ngữ từ browser
  .use(initReactI18next) // Plugin tích hợp với React
  .init({
    // Cấu hình resources - chứa tất cả translation data
    resources: {
      en: { translation: en }, // English translations
      vi: { translation: vi }  // Vietnamese translations
    },
    fallbackLng: 'en', // Ngôn ngữ mặc định nếu không tìm thấy translation
    interpolation: {
      escapeValue: false // Không escape HTML trong translation strings
    }
  });

export default i18n; 