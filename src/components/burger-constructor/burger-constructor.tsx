import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useMemo, useState } from 'react';

import OrderDetails from '@components/order-details/order-details.tsx';

import type { TIngredient } from '@utils/types.ts';
import type { FC } from 'react';

import styles from './burger-constructor.module.css';

type BurgerConstructorProps = {
  order: TIngredient[];
};

export const BurgerConstructor: FC<BurgerConstructorProps> = ({ order }) => {
  const [orderId, setOrderId] = useState<string | null>(null);

  const finalPrice = useMemo(() => {
    return order?.reduce((result, currentValue) => {
      return result + currentValue?.price;
    }, 0);
  }, [order]);

  const getConstructorType = useCallback(
    (index: number) => {
      if (index === 0) {
        return 'top';
      }
      if (index === order?.length - 1) {
        return 'bottom';
      }
      return undefined;
    },
    [order?.length]
  );

  const renderConstructor = useMemo(() => {
    return order?.map((item, index) => {
      const isLocked = item?.type === 'bun';
      const constructorType = getConstructorType(index);
      return (
        <li key={item?._id} className={styles.constructor_item}>
          {!isLocked && <DragIcon type="primary" />}
          <ConstructorElement
            type={constructorType}
            isLocked={isLocked}
            text={item?.name}
            thumbnail={item?.image_mobile}
            price={item?.price}
          />
        </li>
      );
    });
  }, [order]);

  const closeOrderDetails = () => {
    setOrderId(null);
  };

  return (
    <section className={styles.burger_constructor}>
      {orderId && <OrderDetails orderId={orderId} onClose={closeOrderDetails} />}
      <ul className={styles.constructor_wrapper}>{renderConstructor}</ul>
      <div className={styles.constructor_order}>
        <div className={styles.constructor_price}>
          <span className="text text_type_digits-medium">{finalPrice}</span>
          <CurrencyIcon className={styles.currency_icon} type="primary" />
        </div>
        <Button size="large" htmlType="submit" onClick={() => setOrderId('034536')}>
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};
