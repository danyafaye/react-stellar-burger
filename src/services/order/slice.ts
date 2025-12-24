import { createAsyncThunk, createSlice, nanoid } from '@reduxjs/toolkit';

import { baseUrl } from '@utils/constants.ts';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TCreateOrderRequest, TIngredient, TOrder } from '@utils/types.ts';

export type TOrderIngredient = TIngredient & {
  uniqueId: string;
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData: TCreateOrderRequest, { rejectWithValue }) => {
    try {
      const response = await fetch(`${baseUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorMessage = `Ошибка ${response.status}: ${response.statusText}`;
        return rejectWithValue(errorMessage);
      }

      const data = (await response.json()) as TOrder;

      if (!data.success) {
        return rejectWithValue('API вернул неуспешный ответ');
      }

      return data;
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

type OrderState = {
  bun: TIngredient | null;
  ingredients: TOrderIngredient[];
  totalPrice: number;
  orderRequest: {
    loading: boolean;
    error: string | null;
    orderNumber: number | null;
    orderName: string | null;
  };
};

const initialState: OrderState = {
  bun: null,
  ingredients: [],
  totalPrice: 0,
  orderRequest: {
    loading: false,
    error: null,
    orderNumber: null,
    orderName: null,
  },
};

const calculateTotalPrice = (
  bun: TIngredient | null,
  ingredients: TOrderIngredient[]
): number => {
  const bunPrice = bun ? bun.price * 2 : 0;
  const ingredientsPrice = ingredients.reduce(
    (sum, ingredient) => sum + ingredient.price,
    0
  );
  return bunPrice + ingredientsPrice;
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      const ingredient = action.payload;

      if (ingredient.type === 'bun') {
        state.bun = ingredient;
      } else {
        const orderIngredient: TOrderIngredient = {
          ...ingredient,
          uniqueId: nanoid(),
        };
        state.ingredients.push(orderIngredient);
      }

      state.totalPrice = calculateTotalPrice(state.bun, state.ingredients);
    },

    removeIngredient: (state, action: PayloadAction<string>) => {
      const uniqueId = action.payload;
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.uniqueId !== uniqueId
      );
      state.totalPrice = calculateTotalPrice(state.bun, state.ingredients);
    },

    moveIngredient: (
      state,
      action: PayloadAction<{ dragIndex: number; hoverIndex: number }>
    ) => {
      const { dragIndex, hoverIndex } = action.payload;
      const draggedIngredient = state.ingredients[dragIndex];

      state.ingredients.splice(dragIndex, 1);
      state.ingredients.splice(hoverIndex, 0, draggedIngredient);
    },

    clearOrder: (state) => {
      state.bun = null;
      state.ingredients = [];
      state.totalPrice = 0;
    },

    clearOrderRequest: (state) => {
      state.orderRequest = {
        loading: false,
        error: null,
        orderNumber: null,
        orderName: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest.loading = true;
        state.orderRequest.error = null;
        state.orderRequest.orderNumber = null;
        state.orderRequest.orderName = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest.loading = false;
        state.orderRequest.orderNumber = action.payload.order.number;
        state.orderRequest.orderName = action.payload.name;
        state.orderRequest.error = null;

        state.bun = null;
        state.ingredients = [];
        state.totalPrice = 0;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest.loading = false;
        state.orderRequest.error =
          ((action.payload as string) || action.error.message) ??
          'Произошла ошибка при создании заказа';
      });
  },
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearOrder,
  clearOrderRequest,
} = orderSlice.actions;
export default orderSlice.reducer;
