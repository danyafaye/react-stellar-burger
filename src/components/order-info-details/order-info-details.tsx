import { CurrencyIcon, Preloader } from '@krgaa/react-developer-burger-ui-components';
import { type FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { useAppDispatch } from '@hooks/useAppDispatch.ts';
import { useAppSelector } from '@hooks/useAppSelector.ts';
import { selectIngredients } from '@services/ingredients/selectors.ts';
import { orderSlice } from '@services/order/slice.ts';
import { statusesInfo, WS_URL_ALL } from '@utils/constants.ts';
import { getCookie } from '@utils/cookie.ts';
import { getOrderInfo } from '@utils/helpers.ts';

import styles from './order-info-details.module.css';

type OrderInfoDetailsProps = {
  isModal?: boolean;
  profileOrder?: boolean;
};

export const OrderInfoDetails: FC<OrderInfoDetailsProps> = ({
  isModal,
  profileOrder,
}) => {
  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const ingredients = useAppSelector(selectIngredients);
  const { orders } = useAppSelector((state) => state.order);

  const accessToken = getCookie('accessToken')?.replace('Bearer ', '');
  const wsUrl = `wss://norma.education-services.ru/orders?token=${accessToken}`;

  const orderInfo = useMemo(() => {
    const order = orders.find((order) => order._id === params.id);
    if (!order) return undefined;
    return getOrderInfo(order, ingredients);
  }, [orders]);

  useEffect(() => {
    if (!orders.length) {
      dispatch(orderSlice.actions.wsInit(profileOrder ? wsUrl : WS_URL_ALL));

      return () => {
        dispatch(orderSlice.actions.wsClose());
      };
    }
  }, []);

  const renderIngredients = useMemo(() => {
    return orderInfo?.ingredients.map((it) => (
      <div className={styles.ingredient} key={it.uniqueId}>
        <img className={styles.image} src={it.imgSrc} alt={it.name} />
        <span className={`${styles.ingredientName} text text_type_main-default`}>
          {it.name}
        </span>
        <div className={styles.cost}>
          <span className="text text_type_digits-default">{`${it.count} x ${it.price}`}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    ));
  }, [orderInfo?.ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return (
    <section className={`${styles.container} ${!isModal && 'mt-30'}`}>
      <p
        className={`${styles.title} text text_type_digits-default ${!isModal && styles.titleCenter}`}
      >
        #{orderInfo.number}
      </p>
      <div className={styles.info}>
        <h4 className="text text_type_main-medium">{orderInfo.name}</h4>
        <span
          className={`text text_type_main-default`}
          style={{ color: statusesInfo[orderInfo.status].color }}
        >
          {statusesInfo[orderInfo.status].text}
        </span>
      </div>
      <span className="text text_type_main-medium pt-10">Состав:</span>
      <ul className={`${styles.ingredients} mt-1 pr-6`}>{renderIngredients}</ul>
      <div className={styles.footer}>
        <span className="text text_type_main-default text_color_inactive">
          {orderInfo.date}
        </span>
        <div className={styles.cost}>
          <span className="text text_type_digits-default">{orderInfo.cost}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </section>
  );
};
