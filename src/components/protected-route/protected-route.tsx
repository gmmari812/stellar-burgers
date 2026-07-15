import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectInit } from '../../services/user/user-slice';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false
}: ProtectedRouteProps) => {
  const isInit = useSelector(selectInit);
  const location = useLocation();

  if (onlyUnAuth && isInit) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  if (!onlyUnAuth && !isInit) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
