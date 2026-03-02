import { createAsyncThunk, createSlice, nanoid } from '@reduxjs/toolkit';

import { fetchWithRefresh, handleApiError } from '@services/rest.ts';
import { getCookie } from '@utils/cookie.ts';

import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  TCreateOrderRequest,
  TIngredient,
  TOrder,
  TWSOrder,
  TWSResponse,
} from '@utils/types.ts';

export type TOrderIngredient = TIngredient & {
  uniqueId: string;
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData: TCreateOrderRequest, { rejectWithValue }) => {
    try {
      return await fetchWithRefresh<TOrder>('/orders', {
        method: 'POST',
        headers: {
          authorization: getCookie('accessToken') ?? '',
        },
        body: JSON.stringify(orderData),
      });
    } catch (error) {
      return rejectWithValue(handleApiError(error));
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
  orders: TWSOrder[];
  total: number;
  totalToday: number;
  wsConnected: boolean;
  wsError: string | null;
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
  orders: [],
  total: 0,
  totalToday: 0,
  wsConnected: false,
  wsError: null,
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

export const addIngredientWithPrice = createAsyncThunk(
  'order/addIngredientWithPrice',
  (ingredient: TIngredient, { getState }) => {
    const state = getState() as { order: OrderState };

    let newBun = state.order.bun;
    const newIngredients = [...state.order.ingredients];

    if (ingredient.type === 'bun') {
      newBun = ingredient;
    } else {
      const orderIngredient: TOrderIngredient = {
        ...ingredient,
        uniqueId: nanoid(),
      };
      newIngredients.push(orderIngredient);
    }

    const totalPrice = calculateTotalPrice(newBun, newIngredients);

    return {
      ingredient:
        ingredient.type === 'bun' ? ingredient : { ...ingredient, uniqueId: nanoid() },
      totalPrice,
    };
  }
);

export const removeIngredientWithPrice = createAsyncThunk(
  'order/removeIngredientWithPrice',
  (uniqueId: string, { getState }) => {
    const state = getState() as { order: OrderState };

    const newIngredients = state.order.ingredients.filter(
      (ingredient) => ingredient.uniqueId !== uniqueId
    );

    const totalPrice = calculateTotalPrice(state.order.bun, newIngredients);

    return { uniqueId, totalPrice };
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
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
    wsConnectionSuccess: (state) => {
      state.wsConnected = true;
      state.wsError = null;
    },
    wsConnectionError: (state, action: PayloadAction<string>) => {
      state.wsConnected = false;
      state.wsError = action.payload;
    },
    wsConnectionClosed: (state) => {
      state.wsConnected = false;
    },
    wsGetOrders: (state, action: PayloadAction<TWSResponse>) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    },
    wsInit: (_state, _action: PayloadAction<string>) => {
      /* empty */
    },
    wsClose: (_state) => {
      /* empty */
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addIngredientWithPrice.fulfilled, (state, action) => {
        const { ingredient, totalPrice } = action.payload;

        if (ingredient.type === 'bun') {
          state.bun = ingredient;
        } else {
          state.ingredients.push(ingredient as TOrderIngredient);
        }

        state.totalPrice = totalPrice;
      })
      .addCase(removeIngredientWithPrice.fulfilled, (state, action) => {
        const { uniqueId, totalPrice } = action.payload;
        state.ingredients = state.ingredients.filter(
          (ingredient) => ingredient.uniqueId !== uniqueId
        );
        state.totalPrice = totalPrice;
      })
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

export {
  addIngredientWithPrice as addIngredient,
  removeIngredientWithPrice as removeIngredient,
};

export const {
  moveIngredient,
  clearOrder,
  clearOrderRequest,
  wsConnectionSuccess,
  wsConnectionError,
  wsConnectionClosed,
  wsGetOrders,
  wsInit,
  wsClose,
} = orderSlice.actions;
export default orderSlice.reducer;
