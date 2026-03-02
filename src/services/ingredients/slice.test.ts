import { describe, expect, it } from 'vitest';

import reducer, {
  setCurrentIngredient,
  clearCurrentIngredient,
  fetchIngredients,
} from './slice';

import type { TIngredient } from '@utils/types';

const initialState = {
  ingredients: [],
  loading: false,
  error: null,
  currentIngredient: null,
};

const mockIngredient: TIngredient = {
  _id: '1',
  name: 'Ingredient 1',
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

describe('ingredients slice', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setCurrentIngredient', () => {
    const state = reducer(initialState, setCurrentIngredient(mockIngredient));
    expect(state.currentIngredient).toEqual(mockIngredient);
  });

  it('should handle clearCurrentIngredient', () => {
    const stateWithIngredient = { ...initialState, currentIngredient: mockIngredient };
    const state = reducer(stateWithIngredient, clearCurrentIngredient());
    expect(state.currentIngredient).toBeNull();
  });

  it('should handle fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = reducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: [mockIngredient],
    };
    const state = reducer({ ...initialState, loading: true }, action);
    expect(state.loading).toBe(false);
    expect(state.ingredients).toEqual([mockIngredient]);
    expect(state.error).toBeNull();
  });

  it('should handle fetchIngredients.rejected', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      payload: 'error',
    };
    const state = reducer({ ...initialState, loading: true }, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('error');
  });
});
