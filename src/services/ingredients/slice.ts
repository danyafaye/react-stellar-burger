import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { apiRequest, handleApiError } from '@services/rest.ts';

import type { ResponseType, TIngredient } from '@utils/types.ts';

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiRequest<ResponseType<TIngredient>>('/ingredients');
      return data.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

type IngredientsState = {
  ingredients: TIngredient[];
  loading: boolean;
  error: string | null;
  currentIngredient: TIngredient | null;
};

const initialState: IngredientsState = {
  ingredients: [],
  loading: false,
  error: null,
  currentIngredient: null,
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setCurrentIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.currentIngredient = action.payload;
    },

    clearCurrentIngredient: (state) => {
      state.currentIngredient = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
        state.error = null;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error =
          ((action.payload as string) || action.error.message) ??
          'Произошла ошибка при загрузке данных';
      });
  },
});

export const { setCurrentIngredient, clearCurrentIngredient } = ingredientsSlice.actions;
export default ingredientsSlice.reducer;
