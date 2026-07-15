import { FC, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

import { RootState, useDispatch, useSelector } from '../../services/store';
import {
  orderBurger,
  resetOrder,
  TActiveOrder
} from '../../services/order/order-slice';
import { selectUser } from '../../services/user/user-slice';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorItems: TActiveOrder = useSelector(
    (state: RootState) => state.order.current
  );
  const user = useSelector(selectUser);

  const orderRequest = useSelector(
    (state: RootState) => state.order.orderLoading
  );

  const orderModalData = useSelector(
    (state: RootState) => state.order.orderData
  );

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) {
      console.log('Выберите булочку и одну начинку');
      return;
    }
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }
    const itemsIds = constructorItems.ingredients.map((item) => item._id);

    dispatch(
      orderBurger([
        ...itemsIds,
        constructorItems.bun._id,
        constructorItems.bun._id
      ])
    );
  };
  const closeOrderModal = () => {
    dispatch(resetOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients
        .map((i) => i.price)
        .reduce((s: number, v: number) => s + v, 0),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
