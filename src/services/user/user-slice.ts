import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUser
} from './user-actions';

export interface UserState {
  init: boolean;
  loading: boolean;
  user: TUser | null;
}

const initialState: UserState = {
  init: false,
  loading: false,
  user: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<TUser | null>) => {
      state.user = action.payload;
    },
    setInit: (state, action: PayloadAction<boolean>) => {
      state.init = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  },
  selectors: {
    selectUser: (state) => state.user,
    selectInit: (state) => state.init,
    selectLoading: (state) => state.loading
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loginUser.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.init = true;
      state.user = payload.user;
    });
    builder.addCase(loginUser.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(registerUser.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.init = true;
      state.user = payload.user;
    });
    builder.addCase(registerUser.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(getUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getUser.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.init = true;
      state.user = payload.user;
    });
    builder.addCase(getUser.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(logoutUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logoutUser.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.init = false;
    });
    builder.addCase(logoutUser.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(updateUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateUser.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.user = payload.user;
    });
    builder.addCase(updateUser.rejected, (state) => {
      state.loading = false;
    });
  }
});

export const { setInit, setLoading, setUser } = userSlice.actions;
export const { selectUser, selectInit, selectLoading } = userSlice.selectors;

export default userSlice.reducer;
