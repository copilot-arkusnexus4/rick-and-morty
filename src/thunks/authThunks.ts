import axios from 'axios';
import type { Dispatch } from 'redux';
import { login } from '../store/slices/authSlice';

export const loginUser = (email: string, password: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.get('/users.json');
      const users = response.data;

      const matchedUser = users.find(
        (user: { email: string; password: string }) =>
          user.email === email && user.password === password
      );

      if (matchedUser) {
        dispatch(login(email));
        return { success: true };
      } else {
        return { success: false, error: 'Incorrect email or password ❌' };
      }
    } catch (error) {
      console.error('Error loading users:', error);
      return { success: false, error: 'There was an error trying to log in' };
    }
  };
};