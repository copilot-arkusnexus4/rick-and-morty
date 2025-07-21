export interface FavoritesState {
  favoritesByUser: Record<string, number[]>; // email -> array of character IDs
}

const FAVORITES_STORAGE_KEY = 'rickmorty_favorites';

function loadFavoritesFromStorage(): Record<string, number[]> {
  try {
    const data = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function saveFavoritesToStorage(favorites: Record<string, number[]>) {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  } catch {
    // Silently fail if localStorage is not available
  }
}

const TOGGLE_FAVORITE = 'favorites/toggle_favorite';
const TOGGLE_FAVORITES_BULK = 'favorites/toggle_favorites_bulk';
const CLEAR_USER_FAVORITES = 'favorites/clear_user_favorites';

const initialState: FavoritesState = {
  favoritesByUser: loadFavoritesFromStorage(),
};

// Simple explicit action types (KISS)
type ToggleFavoriteAction = { type: typeof TOGGLE_FAVORITE; payload: { userId: string; characterId: number } };
type ToggleFavoritesBulkAction = { type: typeof TOGGLE_FAVORITES_BULK; payload: { userId: string; characterIds: number[] } };
type ClearUserFavoritesAction = { type: typeof CLEAR_USER_FAVORITES; payload: { userId: string } };

export type FavoritesAction =
  | ToggleFavoriteAction
  | ToggleFavoritesBulkAction
  | ClearUserFavoritesAction;

export function favoritesReducer(
  state: FavoritesState = initialState,
  action: FavoritesAction
): FavoritesState {
  switch (action.type) {
    case TOGGLE_FAVORITE: {
      const { userId, characterId } = action.payload;
      const userFavorites = state.favoritesByUser[userId] ? [...state.favoritesByUser[userId]] : [];
      const index = userFavorites.indexOf(characterId);
      if (index === -1) {
        userFavorites.push(characterId);
      } else {
        userFavorites.splice(index, 1);
      }
      const newState: FavoritesState = {
        ...state,
        favoritesByUser: {
          ...state.favoritesByUser,
          [userId]: userFavorites,
        },
      };
      if (userFavorites.length === 0) {
        const { [userId]: removed, ...rest } = newState.favoritesByUser;
        newState.favoritesByUser = rest;
      }
      saveFavoritesToStorage(newState.favoritesByUser);
      return newState;
    }
    case TOGGLE_FAVORITES_BULK: {
      const { userId, characterIds } = action.payload;
      const userFavorites = state.favoritesByUser[userId] ? [...state.favoritesByUser[userId]] : [];
      characterIds.forEach(characterId => {
        const index = userFavorites.indexOf(characterId);
        if (index === -1) {
          userFavorites.push(characterId);
        } else {
          userFavorites.splice(index, 1);
        }
      });
      const newState: FavoritesState = {
        ...state,
        favoritesByUser: {
          ...state.favoritesByUser,
          [userId]: userFavorites,
        },
      };
      if (userFavorites.length === 0) {
        const { [userId]: removed, ...rest } = newState.favoritesByUser;
        newState.favoritesByUser = rest;
      }
      saveFavoritesToStorage(newState.favoritesByUser);
      return newState;
    }
    case CLEAR_USER_FAVORITES: {
      const { userId } = action.payload;
      const { [userId]: removed, ...rest } = state.favoritesByUser;
      const newState: FavoritesState = {
        ...state,
        favoritesByUser: rest,
      };
      saveFavoritesToStorage(newState.favoritesByUser);
      return newState;
    }
    default:
      return state;
  }
}

export const toggleFavorite = (userId: string, characterId: number): ToggleFavoriteAction => ({
  type: TOGGLE_FAVORITE,
  payload: { userId, characterId },
});

export const toggleFavoritesBulk = (userId: string, characterIds: number[]): ToggleFavoritesBulkAction => ({
  type: TOGGLE_FAVORITES_BULK,
  payload: { userId, characterIds },
});

export const clearUserFavorites = (userId: string): ClearUserFavoritesAction => ({
  type: CLEAR_USER_FAVORITES,
  payload: { userId },
});

// Selectors
export const selectUserFavorites = (state: { favorites: FavoritesState }, userId: string): number[] => {
  return state.favorites.favoritesByUser[userId] || [];
};

export const selectIsFavorite = (state: { favorites: FavoritesState }, userId: string, characterId: number): boolean => {
  return (state.favorites.favoritesByUser[userId] || []).includes(characterId);
};

export const selectFavoritesCount = (state: { favorites: FavoritesState }, userId: string): number => {
  return (state.favorites.favoritesByUser[userId] || []).length;
}; 