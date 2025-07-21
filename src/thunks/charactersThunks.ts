import type { Dispatch } from 'redux';
import api from '../services/api';
import {
  fetchCharactersRequest,
  fetchCharactersSuccess,
  fetchCharactersFailure,
} from '../store/slices/charactersSlice';

export const fetchCharacters = (page: number = 1, searchName?: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchCharactersRequest());
    try {
      const searchParams = searchName?.trim() ? { name: searchName.trim() } : {};
      const res = await api.character(page, searchParams);
      dispatch(fetchCharactersSuccess(res));
    } catch (err: unknown) {
      const message = (typeof err === 'object' && err && 'message' in err)
        ? String((err as { message: unknown }).message)
        : 'Unknown error';
      dispatch(fetchCharactersFailure(message));
    }
  };
};