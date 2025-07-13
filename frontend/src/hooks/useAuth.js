import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, updateUserProfile } from '../store/thunks/authThunks';
import { logout } from '../store/slices/authSlice';
import { USER_ROLES } from '../constants';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const login = async (credentials) => {
    try {
      await dispatch(loginUser(credentials)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      await dispatch(registerUser(userData)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      await dispatch(updateUserProfile(profileData)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logoutUser = () => {
    dispatch(logout());
    navigate('/login');
  };

  const hasRole = (roles) => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  const isAdmin = () => hasRole(USER_ROLES.ADMIN);
  const isStaff = () => hasRole([USER_ROLES.STAFF, USER_ROLES.ADMIN]);
  const isDonor = () => hasRole(USER_ROLES.DONOR);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    updateProfile,
    logout: logoutUser,
    hasRole,
    isAdmin,
    isStaff,
    isDonor,
  };
}; 