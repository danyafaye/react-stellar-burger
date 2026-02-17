import { useAppSelector } from '@/hooks/useAppSelector';
import { getOrderInfo } from '@/utils/helpers';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { OrderBlock } from '@components/order-block/order-block.tsx';
import { useAppDispatch } from '@hooks/useAppDispatch.ts';
import { selectIngredients } from '@services/ingredients/selectors.ts';
import { orderSlice } from '@services/order/slice.ts';
import { WS_URL_ALL } from '@utils/constants.ts';

import type { TWSOrder } from '@utils/types.ts';

import styles from './feed-page.module.css';

export const FeedPage = () => {
  const dispatch = useAppDispatch();
  const ingredients = useAppSelector(selectIngredients);
  const { orders, total, totalToday } = useAppSelector((state) => state.order);
  const navigate = useNavigate();
  const location = useLocation();

  const renderOrderNumbers = useCallback(
    (status: TWSOrder['status']) => {
      return orders
        .filter((order) => order.status === status)
        .map((order) => (
          <li
            key={order._id}
            className={`${styles.readyOrder} text text_type_digits-default`}
          >
            {order.number}
          </li>
        ));
    },
    [orders]
  );

  const handleOrderClick = (id: string) => {
    void navigate(`/feed/${id}`, { state: { background: location } });
  };

  const renderOrders = useMemo(() => {
    return orders.map((order) => {
      const orderInfo = getOrderInfo(order, ingredients);
      return (
        <OrderBlock
          onClick={() => handleOrderClick(order._id)}
          key={order._id}
          orderInfo={orderInfo}
        />
      );
    });
  }, [orders, ingredients, handleOrderClick]);

  useEffect(() => {
    dispatch(orderSlice.actions.wsInit(WS_URL_ALL));

    return () => {
      dispatch(orderSlice.actions.wsClose());
    };
  }, [dispatch]);

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <article className={styles.container}>
      <h1 className="text text_type_main-large">Лента заказов</h1>
      <div className={styles.feedContainer}>
        <section className={styles.feedMain}>{renderOrders}</section>
        <section className={styles.feedInfo}>
          <div className={styles.orderNumbers}>
            <div className={styles.orderNumbersBlock}>
              <span className="text text_type_main-medium">Готовы:</span>
              <ul className={styles.orderNumbersList}>{renderOrderNumbers('done')}</ul>
            </div>
            <div className={styles.orderNumbersBlock}>
              <span className="text text_type_main-medium">В работе:</span>
              <ul className={styles.orderNumbersList}>
                {renderOrderNumbers('pending')}
              </ul>
            </div>
          </div>
          <div className={styles.total}>
            <span className="text text_type_main-medium">Выполнено за все время:</span>
            <p className={`${styles.totalText} text text_type_digits-large`}>{total}</p>
          </div>
          <div className={styles.total}>
            <span className="text text_type_main-medium">Выполнено за сегодня:</span>
            <p className={`${styles.totalText} text text_type_digits-large`}>
              {totalToday}
            </p>
          </div>
        </section>
      </div>
    </article>
  );
};
