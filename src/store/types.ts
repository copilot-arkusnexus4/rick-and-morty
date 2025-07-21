export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  avatar: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface RootState {
  auth: AuthState;
}

// Action Types
export const AUTH_LOGIN_REQUEST = 'AUTH_LOGIN_REQUEST';
export const AUTH_LOGIN_SUCCESS = 'AUTH_LOGIN_SUCCESS';
export const AUTH_LOGIN_FAILURE = 'AUTH_LOGIN_FAILURE';
export const AUTH_LOGOUT = 'AUTH_LOGOUT';
export const AUTH_CLEAR_ERROR = 'AUTH_CLEAR_ERROR';
export const AUTH_LOAD_USER = 'AUTH_LOAD_USER';

export interface AuthLoginRequestAction {
  type: typeof AUTH_LOGIN_REQUEST;
}

export interface AuthLoginSuccessAction {
  type: typeof AUTH_LOGIN_SUCCESS;
  payload: User;
}

export interface AuthLoginFailureAction {
  type: typeof AUTH_LOGIN_FAILURE;
  payload: string;
}

export interface AuthLogoutAction {
  type: typeof AUTH_LOGOUT;
}

export interface AuthClearErrorAction {
  type: typeof AUTH_CLEAR_ERROR;
}

export interface AuthLoadUserAction {
  type: typeof AUTH_LOAD_USER;
  payload: User | null;
}

export type AuthActionTypes = 
  | AuthLoginRequestAction
  | AuthLoginSuccessAction
  | AuthLoginFailureAction
  | AuthLogoutAction
  | AuthClearErrorAction
  | AuthLoadUserAction; 