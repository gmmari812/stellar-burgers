import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  useMatch
} from 'react-router-dom';
import { useEffect } from 'react';

import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Preloader } from '@ui';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { getIngredients } from '../../services/ingredients/ingredients-slice';
import { ProtectedRoute } from '../protected-route/protected-route';
import { getUser } from '../../services/user/user-actions';

import '../../index.css';
import styles from './app.module.css';

const App = () => {
  /** TODO: взять переменные из стора */

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state?.background;

  const orderNumber = useMatch('/profile/orders/:number')?.params.number;
  const feedNumber = useMatch('/feed/:number')?.params.number;

  useEffect(() => {
    dispatch(getIngredients());
    dispatch(getUser());
  }, []);

  const isIngredientsLoading = useSelector(
    (state: RootState) => state.ingredients.loading
  );
  const ingredients = useSelector(
    (state: RootState) => state.ingredients.ingredients
  );
  const error = null;

  return (
    <div className={styles.app}>
      <Routes location={background || location}>
        <Route path={'/'} element={<AppHeader />}>
          <Route
            path={'/'}
            element={
              isIngredientsLoading ? (
                <Preloader />
              ) : error ? (
                <div
                  className={`${styles.error} text text_type_main-medium pt-4`}
                >
                  {error}
                </div>
              ) : ingredients.length > 0 ? (
                <ConstructorPage />
              ) : (
                <div
                  className={`${styles.title} text text_type_main-medium pt-4`}
                >
                  Нет игредиентов
                </div>
              )
            }
          />
          <Route path={'/feed'} element={<Feed />} />
          <Route
            path={'/login'}
            element={
              <ProtectedRoute onlyUnAuth>
                <Login />
              </ProtectedRoute>
            }
          />
          <Route
            path={'/register'}
            element={
              <ProtectedRoute onlyUnAuth>
                <Register />
              </ProtectedRoute>
            }
          />
          <Route
            path={'/forgot-password'}
            element={
              <ProtectedRoute onlyUnAuth>
                <ForgotPassword />
              </ProtectedRoute>
            }
          />
          <Route
            path={'/reset-password'}
            element={
              <ProtectedRoute onlyUnAuth>
                <ResetPassword />
              </ProtectedRoute>
            }
          />
          <Route
            path={'/profile'}
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path={'/profile/orders'}
            element={
              <ProtectedRoute>
                <ProfileOrders />
              </ProtectedRoute>
            }
          />
          <Route path={'*'} element={<NotFound404 />} />
          <Route path={'/feed/:number'} element={<OrderInfo />} />
          <Route path={'/ingredients/:id'} element={<IngredientDetails />} />
          <Route
            path={'/profile/orders/:number'}
            element={
              <ProtectedRoute>
                <OrderInfo />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
      {background && (
        <Routes>
          <Route
            path={'/feed/:number'}
            element={
              <Modal
                title={`#${feedNumber}`}
                onClose={function (): void {
                  navigate(-1);
                }}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path={'/ingredients/:id'}
            element={
              <Modal
                title={'Описание ингредиента'}
                onClose={function (): void {
                  navigate(-1);
                }}
              >
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path={'/profile/orders/:number'}
            element={
              <ProtectedRoute>
                <Modal
                  title={`#${orderNumber}`}
                  onClose={function (): void {
                    navigate(-1);
                  }}
                >
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
