// User Roles
export const ROLES = {
  ADMIN: 'ADMIN',
  DONOR: 'DONOR',
  STAFF: 'STAFF',
  MEDICALCENTER: 'MEDICALCENTER',
};

// Blood Request Status
export const BLOOD_REQUEST_STATUS = {
  PENDING: 'PENDING',
  WAITING: 'WAITING',
  PRIORITY: 'PRIORITY',
  OUT_OF_STOCK: 'OUT_OF_STOCK',
  CONFIRM: 'CONFIRM',
};

// Blood Urgency Level
export const BLOOD_URGENCY_LEVEL = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
};

// Registration Status
export const REGISTRATION_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
};

// Blood Types
export const BLOOD_TYPES = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
];

// Status Labels for UI
export const STATUS_LABELS = {
  [BLOOD_REQUEST_STATUS.PENDING]: 'Chờ xử lý',
  [BLOOD_REQUEST_STATUS.WAITING]: 'Đang xử lý',
  [BLOOD_REQUEST_STATUS.PRIORITY]: 'Ưu tiên',
  [BLOOD_REQUEST_STATUS.OUT_OF_STOCK]: 'Hết hàng',
  [BLOOD_REQUEST_STATUS.CONFIRM]: 'Đã xác nhận',
  [REGISTRATION_STATUS.PENDING]: 'Chờ xác nhận',
  [REGISTRATION_STATUS.CONFIRMED]: 'Đã xác nhận',
  [REGISTRATION_STATUS.CANCELLED]: 'Đã hủy',
};

// Urgency Level Labels
export const URGENCY_LABELS = {
  [BLOOD_URGENCY_LEVEL.LOW]: 'Thấp',
  [BLOOD_URGENCY_LEVEL.MEDIUM]: 'Trung bình',
  [BLOOD_URGENCY_LEVEL.HIGH]: 'Cao',
  [BLOOD_URGENCY_LEVEL.CRITICAL]: 'Khẩn cấp',
};

// Role Labels
export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Quản trị viên',
  [ROLES.DONOR]: 'Người hiến máu',
  [ROLES.STAFF]: 'Nhân viên',
  [ROLES.MEDICALCENTER]: 'Trung tâm y tế',
};

export const ROLE = {
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
  DONOR: 'DONOR',
  MEDICAL_CENTER: 'MEDICAL_CENTER',
}; 