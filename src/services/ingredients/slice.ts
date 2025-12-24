import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { baseUrl } from '@utils/constants.ts';

import type { ResponseType, TIngredient } from '@utils/types.ts';

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${baseUrl}/ingredients`);

      if (!response.ok) {
        const errorMessage = `Ошибка ${response.status}: ${response.statusText}`;
        return rejectWithValue(errorMessage);
      }

      const data = (await response.json()) as ResponseType<TIngredient>;

      if (!data.success) {
        return rejectWithValue('API вернул неуспешный ответ');
      }

      return data.data;
    } catch (error) {
      if (error instanceof TypeError) {
        return rejectWithValue('Ошибка сети: проверьте подключение к интернету');
      }

      if (error instanceof SyntaxError) {
        return rejectWithValue('Ошибка парсинга данных от сервера');
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Произошла неизвестная ошибка';
      return rejectWithValue(errorMessage);
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
