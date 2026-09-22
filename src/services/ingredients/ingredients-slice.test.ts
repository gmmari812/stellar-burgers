import reducer, { initialState, getIngredients } from './ingredients-slice';

import { TIngredient } from '@utils-types';

describe('ingredients reducer', () => {
  const ingredients = [
    {
      _id: '1',
      name: 'Булка',
      type: 'bun'
    }
  ] as TIngredient[];

  it('should return initial state', () => {
    expect(reducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
      initialState
    );
  });

  it('should handle getIngredients.pending', () => {
    const state = reducer(initialState, getIngredients.pending('', undefined));

    expect(state.loading).toBe(true);
    expect(state.ingredients).toEqual([]);
  });

  it('should handle getIngredients.fulfilled', () => {
    const state = reducer(
      {
        ...initialState,
        loading: true
      },
      getIngredients.fulfilled(ingredients, '', undefined)
    );

    expect(state.loading).toBe(false);
    expect(state.ingredients).toEqual(ingredients);
  });

  it('should handle getIngredients.rejected', () => {
    const state = reducer(
      {
        ...initialState,
        loading: true
      },
      getIngredients.rejected(null, '', undefined)
    );

    expect(state.loading).toBe(false);
  });
});
