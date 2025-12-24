import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '../store';

export const selectOrder = (state: RootState) => state.order;
export const selectOrderBun = (state: RootState) => state.order.bun;
export const selectOrderIngredients = (state: RootState) => state.order.ingredients;
export const selectOrderTotalPrice = (state: RootState) => state.order.totalPrice;

export const selectOrderRequest = (state: RootState) => state.order.orderRequest;
export const selectOrderLoading = (state: RootState) => state.order.orderRequest.loading;
export const selectOrderError = (state: RootState) => state.order.orderRequest.error;
export const selectOrderNumber = (state: RootState) =>
  state.order.orderRequest.orderNumber;
export const selectOrderName = (state: RootState) => state.order.orderRequest.orderName;

export const selectIngredientCounts = createSelector(
  [selectOrderBun, selectOrderIngredients],
  (bun, ingredients) => {
    const counts: Record<string, number> = {};

    if (bun) {
      counts[bun._id] = 1;
    }

    ingredients.forEach((ingredient) => {
      counts[ingredient._id] = (counts[ingredient._id] || 0) + 1;
    });

    return counts;
  }
);

export const selectOrderData = createSelector(
  [selectOrderBun, selectOrderIngredients],
  (bun, ingredients) => {
    const ingredientIds: string[] = [];

    if (bun) {
      ingredientIds.push(bun._id);
    }

    ingredients.forEach((ingredient) => {
      ingredientIds.push(ingredient._id);
    });

    if (bun) {
      ingredientIds.push(bun._id);
    }

    return { ingredients: ingredientIds };
  }
);
