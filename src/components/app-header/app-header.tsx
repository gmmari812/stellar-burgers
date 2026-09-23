import { FC } from 'react';
import { AppHeaderUI } from '@ui';

import { Outlet } from 'react-router-dom';
import { RootState, useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const userName = useSelector((state: RootState) => state.user.user?.name);
  return (
    <>
      <AppHeaderUI userName='' />
      <Outlet />
    </>
  );
};
