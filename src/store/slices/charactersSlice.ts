export interface Character {
    id: number;
    name: string;
    status: 'Alive' | 'Dead' | 'unknown';
    species: string;
    type: string;
    gender: 'Female' | 'Male' | 'Genderless' | 'unknown';
    origin: {
        name: string;
        url: string;
    };
    location: {
        name: string;
        url: string;
    };
    image: string;
    episode: string[];     // Episode URLs
    url: string;           // Resource URL
    created: string;       // ISO creation date
}

export interface ApiInfo {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
}

export interface CharactersState {
    loading: boolean;
    items: Character[];
    info: ApiInfo | null;
    error: string | null;
}

const REQ = 'characters/fetch_request';
const OK = 'characters/fetch_success';
const ERR = 'characters/fetch_failure';

const initialState: CharactersState = {
    loading: false,
    items: [],
    info: null,
    error: null,
};

// Simple explicit action types (KISS)
type FetchCharactersRequest = { type: typeof REQ };
type FetchCharactersSuccess = { type: typeof OK; payload: { results: Character[]; info: ApiInfo } };
type FetchCharactersFailure = { type: typeof ERR; payload: string };

export type CharactersAction =
  | FetchCharactersRequest
  | FetchCharactersSuccess
  | FetchCharactersFailure;

export function charactersReducer(
  state: CharactersState = initialState,
  action: CharactersAction
): CharactersState {
  switch (action.type) {
    case REQ:
      return { ...state, loading: true, error: null };
    case OK:
      return {
        ...state,
        loading: false,
        items: action.payload.results,
        info: action.payload.info,
      };
    case ERR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export const fetchCharactersRequest = (): FetchCharactersRequest => ({ type: REQ });
export const fetchCharactersSuccess = (data: { results: Character[]; info: ApiInfo }): FetchCharactersSuccess => ({
  type: OK,
  payload: data,
});
export const fetchCharactersFailure = (error: string): FetchCharactersFailure => ({
  type: ERR,
  payload: error,
});