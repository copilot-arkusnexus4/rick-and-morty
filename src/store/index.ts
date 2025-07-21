// src/store/index.ts
import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import { authReducer } from './slices/authSlice';
import { charactersReducer } from './slices/charactersSlice';
import { favoritesReducer } from './slices/favoritesSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  characters: charactersReducer,
  favorites: favoritesReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;