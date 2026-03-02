import { describe, expect, it } from 'vitest';

import reducer, {
  moveIngredient,
  clearOrder,
  clearOrderRequest,
  wsConnectionSuccess,
  wsConnectionError,
  wsConnectionClosed,
  wsGetOrders,
  addIngredient,
  removeIngredient,
  createOrder,
  initialState,
} from './slice';

import type { TIngredient } from '@utils/types';

const mockBun: TIngredient = {
  _id: '1',
  name: 'Bun 1',
  type: 'bun',
  proteins: 10,
  fat: 10,
  carbohydrates: 10,
  calories: 100,
  price: 100,
  image: 'image',
  image_mobile: 'image_mobile',
  image_large: 'image_large',
  __v: 0,
};

const mockIngredient: TIngredient & { uniqueId: string } = {
  _id: '2',
  name: 'Ingredient 1',
  type: 'sauce',
  proteins: 10,
  fat: 10,
  carbohydrates: 10,
  calories: 100,
  price: 50,
  image: 'image',
  image_mobile: 'image_mobile',
  image_large: 'image_large',
  __v: 0,
  uniqueId: 'unique-id-1',
};

describe('order slice', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle moveIngredient', () => {
    const stateWithIngredients = {
      ...initialState,
      ingredients: [
        { ...mockIngredient, uniqueId: '1' },
        { ...mockIngredient, uniqueId: '2' },
      ],
    };
    const state = reducer(
      stateWithIngredients,
      moveIngredient({ dragIndex: 0, hoverIndex: 1 })
    );
    expect(state.ingredients[0].uniqueId).toBe('2');
    expect(state.ingredients[1].uniqueId).toBe('1');
  });

  it('should handle clearOrder', () => {
    const stateWithData = {
      ...initialState,
      bun: mockBun,
      ingredients: [mockIngredient],
      totalPrice: 250,
    };
    const state = reducer(stateWithData, clearOrder());
    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([]);
    expect(state.totalPrice).toBe(0);
  });

  it('should handle clearOrderRequest', () => {
    const stateWithRequest = {
      ...initialState,
      orderRequest: {
        loading: false,
        error: 'error',
        orderNumber: 123,
        orderName: 'order',
      },
    };
    const state = reducer(stateWithRequest, clearOrderRequest());
    expect(state.orderRequest).toEqual(initialState.orderRequest);
  });

  it('should handle wsConnectionSuccess', () => {
    const state = reducer(initialState, wsConnectionSuccess());
    expect(state.wsConnected).toBe(true);
    expect(state.wsError).toBeNull();
  });

  it('should handle wsConnectionError', () => {
    const state = reducer(initialState, wsConnectionError('error'));
    expect(state.wsConnected).toBe(false);
    expect(state.wsError).toBe('error');
  });

  it('should handle wsConnectionClosed', () => {
    const state = reducer({ ...initialState, wsConnected: true }, wsConnectionClosed());
    expect(state.wsConnected).toBe(false);
  });

  it('should handle wsGetOrders', () => {
    const payload = {
      orders: [],
      total: 100,
      totalToday: 10,
      success: true,
    };
    const state = reducer(initialState, wsGetOrders(payload));
    expect(state.orders).toEqual([]);
    expect(state.total).toBe(100);
    expect(state.totalToday).toBe(10);
  });

  it('should handle addIngredient.fulfilled (bun)', () => {
    const action = {
      type: addIngredient.fulfilled.type,
      payload: {
        ingredient: mockBun,
        totalPrice: 200,
      },
    };
    const state = reducer(initialState, action);
    expect(state.bun).toEqual(mockBun);
    expect(state.totalPrice).toBe(200);
  });

  it('should handle addIngredient.fulfilled (ingredient)', () => {
    const action = {
      type: addIngredient.fulfilled.type,
      payload: {
        ingredient: mockIngredient,
        totalPrice: 50,
      },
    };
    const state = reducer(initialState, action);
    expect(state.ingredients).toContainEqual(mockIngredient);
    expect(state.totalPrice).toBe(50);
  });

  it('should handle removeIngredient.fulfilled', () => {
    const stateWithIngredient = {
      ...initialState,
      ingredients: [mockIngredient],
      totalPrice: 50,
    };
    const action = {
      type: removeIngredient.fulfilled.type,
      payload: {
        uniqueId: mockIngredient.uniqueId,
        totalPrice: 0,
      },
    };
    const state = reducer(stateWithIngredient, action);
    expect(state.ingredients).toEqual([]);
    expect(state.totalPrice).toBe(0);
  });

  it('should handle createOrder.pending', () => {
    const action = { type: createOrder.pending.type };
    const state = reducer(initialState, action);
    expect(state.orderRequest.loading).toBe(true);
    expect(state.orderRequest.error).toBeNull();
  });

  it('should handle createOrder.fulfilled', () => {
    const action = {
      type: createOrder.fulfilled.type,
      payload: {
        order: { number: 123 },
        name: 'Burger',
      },
    };
    const state = reducer(
      {
        ...initialState,
        bun: mockBun,
        ingredients: [mockIngredient],
        totalPrice: 250,
        orderRequest: { ...initialState.orderRequest, loading: true },
      },
      action
    );
    expect(state.orderRequest.loading).toBe(false);
    expect(state.orderRequest.orderNumber).toBe(123);
    expect(state.orderRequest.orderName).toBe('Burger');
    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([]);
    expect(state.totalPrice).toBe(0);
  });

  it('should handle createOrder.rejected', () => {
    const action = {
      type: createOrder.rejected.type,
      payload: 'error',
    };
    const state = reducer(
      { ...initialState, orderRequest: { ...initialState.orderRequest, loading: true } },
      action
    );
    expect(state.orderRequest.loading).toBe(false);
    expect(state.orderRequest.error).toBe('error');
  });
});
