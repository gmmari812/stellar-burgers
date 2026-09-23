import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';

import { useDispatch, useSelector } from '../../services/store';
import {
  getOrders,
  selectHistoryOrders
} from '../../services/order/order-slice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectHistoryOrders);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
