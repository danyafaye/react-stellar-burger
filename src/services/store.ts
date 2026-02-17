import { configureStore } from '@reduxjs/toolkit';

import {
  socketMiddleware,
  type TWSActionTypes,
} from '@services/middleware/socket-middleware.ts';

import authReducer from './auth/slice';
import ingredientsReducer from './ingredients/slice';
import orderReducer, { orderSlice } from './order/slice';

import type { TWSResponse } from '@utils/types.ts';

const wsActions: TWSActionTypes<unknown, TWSResponse> = {
  wsInit: orderSlice.actions.wsInit,
  onOpen: orderSlice.actions.wsConnectionSuccess,
  onClose: orderSlice.actions.wsConnectionClosed,
  onError: orderSlice.actions.wsConnectionError,
  onMessage: orderSlice.actions.wsGetOrders,
  wsSendMessage: undefined,
  wsClose: orderSlice.actions.wsClose,
};

export const store = configureStore({
  reducer: {
    ingredients: ingredientsReducer,
    order: orderReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(socketMiddleware(wsActions)),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
