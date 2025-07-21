// src/store/authSlice.ts
// State typing
export interface AuthState {
  isAuthenticated: boolean;
  user: { email: string } | null;
}

// Initial state
const initialState: AuthState = {
  isAuthenticated: !!localStorage.getItem('user'),
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
};

// Action types
const LOGIN = 'auth/login';
const LOGOUT = 'auth/logout';

type LoginAction = { type: typeof LOGIN; payload: { email: string } };
type LogoutAction = { type: typeof LOGOUT };

type AuthAction = LoginAction | LogoutAction;

// Reducer
export function authReducer(state: AuthState = initialState, action: AuthAction): AuthState {
  switch (action.type) {
    case LOGIN:
      localStorage.setItem('user', JSON.stringify({ email: action.payload.email }));
      return { isAuthenticated: true, user: { email: action.payload.email } };
    case LOGOUT:
      localStorage.removeItem('user');
      return { isAuthenticated: false, user: null };
    default:
      return state;
  }
}

export const login = (email: string): LoginAction => ({ type: LOGIN, payload: { email } });
export const logout = (): LogoutAction => ({ type: LOGOUT });