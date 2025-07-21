import { 
  AuthState, 
  AuthActionTypes,
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGIN_FAILURE,
  AUTH_LOGOUT,
  AUTH_CLEAR_ERROR,
  AUTH_LOAD_USER
} from '../types';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const authReducer = (
  state = initialState,
  action: AuthActionTypes
): AuthState => {
  switch (action.type) {
    case AUTH_LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case AUTH_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
        isAuthenticated: true,
        error: null,
      };
    case AUTH_LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false,
      };
    case AUTH_LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        error: null,
      };
    case AUTH_CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    case AUTH_LOAD_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
      };
    default:
      return state;
  }
}; 