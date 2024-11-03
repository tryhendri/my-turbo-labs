import { GetUserData } from '@my-turbo-labs/shared';
import { Slice, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  user: null | {
    id: string;
    email: string;
    displayName: string | null;
  };
  loading: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  isSuccess: boolean;
  isError: boolean;
}

const initialState: UserState = {
  user: null,
  loading: false,
  errorMessage: null,
  successMessage: null,
  isSuccess: false,
  isError: false,
};

export const userSlice: Slice<UserState> = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<GetUserData | undefined>) => ({
      ...state,
      user: {
        id: action.payload?.id || '',
        displayName: action.payload?.displayName || '',
        email: action.payload?.email || '',
      },
      error: null,
    }),
    logout: () => ({
      ...initialState,
    }),
    setLoading: (state, action: PayloadAction<boolean>) => ({
      ...state,
      loading: action.payload,
    }),
    setError: (state, action: PayloadAction<string | null>) => ({
      ...state,
      errorMessage: action.payload,
      isError: true,
      loading: false,
    }),
    setSuccess: (state, action: PayloadAction<string | null>) => ({
      ...state,
      successMessage: action.payload,
      isSuccess: true,
      loading: false,
      errorMessage: null,
      isError: false,
    }),
    clearMessages: state => ({
      ...state,
      errorMessage: null,
      successMessage: null,
      isError: false,
      isSuccess: false,
    }),
  },
});

export type UserSlice = {
  [key: string]: ReturnType<typeof userSlice.reducer>;
};

export const userSelectors = userSlice.getSelectors<UserSlice>(
  state => state?.user ?? initialState,
);
