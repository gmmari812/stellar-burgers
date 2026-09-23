import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

export const initialState: { loading: boolean; ingredients: TIngredient[] } = {
  loading: false,
  ingredients: []
};

export const getIngredients = createAsyncThunk(
  'ingredients/getIngredients',
  () => getIngredientsApi()
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getIngredients.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getIngredients.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.ingredients = payload;
    });
    builder.addCase(getIngredients.rejected, (state) => {
      state.loading = false;
    });
  }
});

export default ingredientsSlice.reducer;
