import reducer, {
  addIngredient,
  createOrder,
  deleteIngredient,
  shiftIngredient,
  resetOrder,
  orderBurger,
  getOrderByNumber,
  getFeeds,
  getOrders
} from './order-slice';

import { TIngredient, TOrder, TOrdersData } from '@utils-types';

const bun: TIngredient = {
  _id: 'bun-1',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'bun.jpg',
  image_large: 'bun-large.jpg',
  image_mobile: 'bun-mobile.jpg'
};

const filling: TIngredient = {
  _id: 'filling-1',
  name: 'Соус фирменный',
  type: 'sauce',
  proteins: 10,
  fat: 20,
  carbohydrates: 30,
  calories: 300,
  price: 50,
  image: 'sauce.jpg',
  image_large: 'sauce-large.jpg',
  image_mobile: 'sauce-mobile.jpg'
};

const constructorFilling = {
  ...filling,
  id: 'ingredient-1'
};

const order: TOrder = {
  _id: 'order-1',
  status: 'done',
  name: 'Бургер',
  createdAt: '2026-01-01T10:00:00.000Z',
  updatedAt: '2026-01-01T10:00:00.000Z',
  number: 12345,
  ingredients: ['bun-1', 'filling-1']
};

const ordersData: TOrdersData = {
  orders: [order],
  total: 1,
  totalToday: 1
};

describe('order reducer — synchronous actions', () => {
  it('returns the initial state for an unknown action', () => {
    const state = reducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual({
      orderLoading: false,
      feedLoading: false,
      historyLoading: false,
      current: {
        bun: null,
        ingredients: []
      },
      orderData: null,
      orderByNumber: null,
      history: {
        orders: [],
        total: 0,
        totalToday: 0
      },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0
      }
    });
  });

  it('adds a bun to the constructor', () => {
    const state = reducer(undefined, addIngredient(bun));

    expect(state.current.bun).toEqual(bun);
    expect(state.current.ingredients).toEqual([]);
  });

  it('adds a filling to the constructor', () => {
    const state = reducer(undefined, addIngredient(filling));

    expect(state.current.ingredients).toHaveLength(1);
    expect(state.current.ingredients[0]).toMatchObject(filling);
    expect(state.current.ingredients[0].id).toEqual(expect.any(String));
  });

  it('replaces the existing bun when another bun is added', () => {
    const anotherBun = {
      ...bun,
      _id: 'bun-2',
      name: 'Другая булка'
    };

    const state = reducer(
      reducer(undefined, addIngredient(bun)),
      addIngredient(anotherBun)
    );

    expect(state.current.bun).toEqual(anotherBun);
  });

  it('creates an order in history', () => {
    const state = reducer(undefined, createOrder(order));

    expect(state.history.orders).toEqual([order]);
  });

  it('deletes an ingredient from the constructor', () => {
    const firstState = reducer(undefined, addIngredient(filling));

    const firstIngredient = firstState.current.ingredients[0];

    const secondState = reducer(
      firstState,
      addIngredient({
        ...filling,
        _id: 'filling-2',
        name: 'Второй ингредиент'
      })
    );

    const secondIngredient = secondState.current.ingredients[1];

    const state = reducer(
      secondState,
      deleteIngredient({
        id: firstIngredient.id
      })
    );

    expect(state.current.ingredients).toEqual([secondIngredient]);
  });

  it('moves an ingredient to another position', () => {
    const firstState = reducer(undefined, addIngredient(filling));

    const firstIngredient = firstState.current.ingredients[0];

    const secondState = reducer(
      firstState,
      addIngredient({
        ...filling,
        _id: 'filling-2',
        name: 'Второй ингредиент'
      })
    );

    const secondIngredient = secondState.current.ingredients[1];

    const state = reducer(
      secondState,
      shiftIngredient({
        fromIndex: 0,
        toIndex: 1
      })
    );

    expect(state.current.ingredients).toEqual([
      secondIngredient,
      firstIngredient
    ]);
  });

  it('resets the order data', () => {
    const initialState = reducer(undefined, {
      type: orderBurger.fulfilled.type,
      payload: {
        order
      }
    });

    const state = reducer(initialState, resetOrder());

    expect(state.orderData).toBeNull();
  });
});

describe('order reducer — asynchronous actions', () => {
  it('sets orderLoading to true when orderBurger.pending is dispatched', () => {
    const state = reducer(undefined, {
      type: orderBurger.pending.type
    });

    expect(state.orderLoading).toBe(true);
  });

  it('sets orderLoading to false when orderBurger.rejected is dispatched', () => {
    const pendingState = reducer(undefined, {
      type: orderBurger.pending.type
    });

    const state = reducer(pendingState, {
      type: orderBurger.rejected.type
    });

    expect(state.orderLoading).toBe(false);
  });

  it('saves the created order and clears the constructor on orderBurger.fulfilled', () => {
    const stateWithIngredients = reducer(
      reducer(undefined, addIngredient(bun)),
      addIngredient(constructorFilling)
    );

    const state = reducer(stateWithIngredients, {
      type: orderBurger.fulfilled.type,
      payload: {
        order
      }
    });

    expect(state.orderLoading).toBe(false);

    expect(state.orderData).toEqual({
      ...order,
      ingredients: ['filling-1']
    });

    expect(state.current.bun).toBeNull();
    expect(state.current.ingredients).toEqual([]);
  });

  it('sets orderLoading to true when getOrderByNumber.pending is dispatched', () => {
    const state = reducer(undefined, {
      type: getOrderByNumber.pending.type
    });

    expect(state.orderLoading).toBe(true);
  });

  it('sets orderLoading to false when getOrderByNumber.rejected is dispatched', () => {
    const state = reducer(
      reducer(undefined, {
        type: getOrderByNumber.pending.type
      }),
      {
        type: getOrderByNumber.rejected.type
      }
    );

    expect(state.orderLoading).toBe(false);
  });

  it('saves the requested order when getOrderByNumber.fulfilled is dispatched', () => {
    const state = reducer(undefined, {
      type: getOrderByNumber.fulfilled.type,
      payload: {
        orders: [order]
      }
    });

    expect(state.orderLoading).toBe(false);
    expect(state.orderByNumber).toEqual(order);
  });

  it('sets feedLoading to true when getFeeds.pending is dispatched', () => {
    const state = reducer(undefined, {
      type: getFeeds.pending.type
    });

    expect(state.feedLoading).toBe(true);
  });

  it('sets feedLoading to false when getFeeds.rejected is dispatched', () => {
    const state = reducer(
      reducer(undefined, {
        type: getFeeds.pending.type
      }),
      {
        type: getFeeds.rejected.type
      }
    );

    expect(state.feedLoading).toBe(false);
  });

  it('saves feed data when getFeeds.fulfilled is dispatched', () => {
    const state = reducer(undefined, {
      type: getFeeds.fulfilled.type,
      payload: ordersData
    });

    expect(state.feedLoading).toBe(false);
    expect(state.feed).toEqual(ordersData);
  });

  it('sets historyLoading to true when getOrders.pending is dispatched', () => {
    const state = reducer(undefined, {
      type: getOrders.pending.type
    });

    expect(state.historyLoading).toBe(true);
  });

  it('sets historyLoading to false when getOrders.rejected is dispatched', () => {
    const state = reducer(
      reducer(undefined, {
        type: getOrders.pending.type
      }),
      {
        type: getOrders.rejected.type
      }
    );

    expect(state.historyLoading).toBe(false);
  });

  it('saves order history when getOrders.fulfilled is dispatched', () => {
    const state = reducer(undefined, {
      type: getOrders.fulfilled.type,
      payload: [order]
    });

    expect(state.historyLoading).toBe(false);
    expect(state.history.orders).toEqual([order]);
  });
});
