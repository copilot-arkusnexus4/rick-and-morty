import { Dispatch } from 'redux';
import { 
  AuthActionTypes, 
  AUTH_LOGIN_REQUEST, 
  AUTH_LOGIN_SUCCESS, 
  AUTH_LOGIN_FAILURE,
  AUTH_LOGOUT,
  AUTH_CLEAR_ERROR,
  AUTH_LOAD_USER,
  User
} from '../types';
import usersData from '../../data/users.json';

export const loginUser = (email: string, password: string) => {
  return async (dispatch: Dispatch<AuthActionTypes>) => {
    dispatch({ type: AUTH_LOGIN_REQUEST });
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find user
      const user = usersData.users.find(
        u => u.email === email && u.password === password
      );
      
      if (!user) {
        dispatch({
          type: AUTH_LOGIN_FAILURE,
          payload: 'Email or password incorrect'
        });
        return;
      }
      
      // Save to localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      dispatch({
        type: AUTH_LOGIN_SUCCESS,
        payload: user
      });
    } catch (error) {
      dispatch({
        type: AUTH_LOGIN_FAILURE,
        payload: 'Connection error'
      });
    }
  };
};

export const logoutUser = () => {
  return (dispatch: Dispatch<AuthActionTypes>) => {
    localStorage.removeItem('currentUser');
    dispatch({ type: AUTH_LOGOUT });
  };
};

export const loadUserFromStorage = () => {
  return (dispatch: Dispatch<AuthActionTypes>) => {
    const userString = localStorage.getItem('currentUser');
    if (userString) {
      const user = JSON.parse(userString) as User;
      dispatch({
        type: AUTH_LOAD_USER,
        payload: user
      });
    } else {
      dispatch({
        type: AUTH_LOAD_USER,
        payload: null
      });
    }
  };
};

export const clearError = (): AuthActionTypes => ({
  type: AUTH_CLEAR_ERROR
}); 