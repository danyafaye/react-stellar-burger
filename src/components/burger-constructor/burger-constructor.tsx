import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useMemo, useState } from 'react';

import { Modal } from '@components/modal/modal.tsx';
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

  const lastOrderIndex = useMemo(() => {
    return order?.length - 1;
  }, [order?.length]);

  const renderConstructorItems = useMemo(() => {
    return order?.map((item, index) => {
      return (
        <div key={index} className={styles.constructor_item}>
          <DragIcon type="primary" />
          <ConstructorElement
            text={item?.name}
            thumbnail={item?.image_mobile}
            price={item?.price}
          />
        </div>
      );
    });
  }, [order]);

  const closeOrderDetails = () => {
    setOrderId(null);
  };

  return (
    <section className={styles.burger_constructor}>
      {orderId && (
        <Modal onClose={closeOrderDetails}>
          <OrderDetails orderId={orderId} />
        </Modal>
      )}
      <ul className={styles.constructor_wrapper}>
        <li className={`${styles.constructor_item} pr-5`}>
          <ConstructorElement
            type="top"
            isLocked
            text={`${order[0]?.name} (верх)`}
            thumbnail={order[0]?.image_mobile}
            price={order[0]?.price}
          />
        </li>
        <li className={`${styles.overflow_constructor} pr-1`}>
          {renderConstructorItems}
        </li>
        <li className={`${styles.constructor_item} pr-5`}>
          <ConstructorElement
            type="bottom"
            isLocked
            text={`${order[lastOrderIndex]?.name} (низ)`}
            thumbnail={order[lastOrderIndex]?.image_mobile}
            price={order[lastOrderIndex]?.price}
          />
        </li>
      </ul>
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
