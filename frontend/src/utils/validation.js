import { VALIDATION } from '../constants';

// Email validation
export const validateEmail = (email) => {
  return VALIDATION.EMAIL_REGEX.test(email);
};

// Password validation
export const validatePassword = (password) => {
  return password.length >= VALIDATION.PASSWORD_MIN_LENGTH;
};

// Phone validation
export const validatePhone = (phone) => {
  return VALIDATION.PHONE_REGEX.test(phone);
};

// Name validation
export const validateName = (name) => {
  return name.length >= VALIDATION.NAME_MIN_LENGTH;
};

// Blood type validation
export const validateBloodType = (bloodType) => {
  const validTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  return validTypes.includes(bloodType);
};

// Form validation helper
export const validateForm = (formData, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = formData[field];
    const fieldRules = rules[field];
    
    // Required validation
    if (fieldRules.required && (!value || value.trim() === '')) {
      errors[field] = `${field} is required`;
      return;
    }
    
    // Skip other validations if field is empty and not required
    if (!value || value.trim() === '') return;
    
    // Email validation
    if (fieldRules.email && !validateEmail(value)) {
      errors[field] = 'Invalid email format';
    }
    
    // Password validation
    if (fieldRules.password && !validatePassword(value)) {
      errors[field] = `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`;
    }
    
    // Phone validation
    if (fieldRules.phone && !validatePhone(value)) {
      errors[field] = 'Invalid phone number format';
    }
    
    // Name validation
    if (fieldRules.name && !validateName(value)) {
      errors[field] = `Name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters`;
    }
    
    // Blood type validation
    if (fieldRules.bloodType && !validateBloodType(value)) {
      errors[field] = 'Invalid blood type';
    }
    
    // Custom validation
    if (fieldRules.custom) {
      const customError = fieldRules.custom(value, formData);
      if (customError) {
        errors[field] = customError;
      }
    }
  });
  
  return errors;
};

// Password confirmation validation
export const validatePasswordConfirmation = (password, confirmPassword) => {
  return password === confirmPassword;
}; 