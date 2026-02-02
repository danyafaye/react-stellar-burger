import { configureStore } from '@reduxjs/toolkit';

import authReducer from './auth/slice';
import ingredientsReducer from './ingredients/slice';
import orderReducer from './order/slice';

export const store = configureStore({
  reducer: {
    ingredients: ingredientsReducer,
    order: orderReducer,
    auth: authReducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
