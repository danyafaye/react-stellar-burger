import { getCookie } from '@/utils/cookie';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { OrderBlock } from '@components/order-block/order-block.tsx';
import { useAppDispatch } from '@hooks/useAppDispatch.ts';
import { useAppSelector } from '@hooks/useAppSelector.ts';
import { selectIngredients } from '@services/ingredients/selectors.ts';
import { orderSlice } from '@services/order/slice.ts';
import { getOrderInfo } from '@utils/helpers.ts';

import styles from './profile-orders-page.module.css';

export const ProfileOrdersPage = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const ingredients = useAppSelector(selectIngredients);
  const { orders } = useAppSelector((state) => state.order);

  const accessToken = getCookie('accessToken')?.replace('Bearer ', '');
  const wsUrl = `wss://norma.education-services.ru/orders?token=${accessToken}`;

  useEffect(() => {
    dispatch(orderSlice.actions.wsInit(wsUrl));

    return () => {
      dispatch(orderSlice.actions.wsClose());
    };
  }, [dispatch]);

  const handleOrderClick = (id: string) => {
    void navigate(`/profile/orders/${id}`, { state: { background: location } });
  };

  const renderOrders = useMemo(() => {
    return orders.map((order) => {
      const orderInfo = getOrderInfo(order, ingredients);
      return (
        <OrderBlock
          key={order._id}
          orderInfo={orderInfo}
          onClick={() => handleOrderClick(order._id)}
          showStatus
        />
      );
    });
  }, [orders, ingredients, handleOrderClick]);

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <section className={styles.container}>
      <ul className={styles.list}>{renderOrders}</ul>
    </section>
  );
};
