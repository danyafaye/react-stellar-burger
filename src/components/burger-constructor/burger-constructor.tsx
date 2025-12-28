import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  Preloader,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo, useRef } from 'react';
import { useDrop } from 'react-dnd';

import { DraggableConstructorItem } from '@components/draggable-constructor-item/draggable-constructor-item.tsx';
import { Modal } from '@components/modal/modal.tsx';
import OrderDetails from '@components/order-details/order-details.tsx';
import { useAppDispatch } from '@hooks/useAppDispatch.ts';
import { useAppSelector } from '@hooks/useAppSelector.ts';
import {
  selectOrderBun,
  selectOrderData,
  selectOrderError,
  selectOrderIngredients,
  selectOrderLoading,
  selectOrderNumber,
  selectOrderTotalPrice,
} from '@services/order/selectors.ts';
import { addIngredient, clearOrderRequest, createOrder } from '@services/order/slice.ts';
import { DND_TYPES } from '@utils/constants.ts';

import type { TIngredient } from '@utils/types.ts';
import type { FC } from 'react';

import styles from './burger-constructor.module.css';

export const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();
  const bun = useAppSelector(selectOrderBun);
  const ingredients = useAppSelector(selectOrderIngredients);
  const totalPrice = useAppSelector(selectOrderTotalPrice);
  const orderData = useAppSelector(selectOrderData);
  const orderError = useAppSelector(selectOrderError);
  const orderLoading = useAppSelector(selectOrderLoading);
  const orderNumber = useAppSelector(selectOrderNumber);
  const dropRef = useRef<HTMLElement>(null);

  const [_, drop] = useDrop<TIngredient, void, void>({
    accept: DND_TYPES.INGREDIENT,
    drop: (ingredient: TIngredient) => {
      void dispatch(addIngredient(ingredient));
    },
  });

  drop(dropRef);

  const canOrder = useMemo(() => {
    return bun && ingredients.length > 0;
  }, [bun, ingredients.length]);

  const showOrderModal = Boolean(orderNumber && !orderLoading && !orderError);

  const closeOrderDetails = () => {
    dispatch(clearOrderRequest());
  };

  const handleOrder = () => {
    if (canOrder) {
      void dispatch(createOrder(orderData));
    }
  };

  useEffect(() => {
    if (orderError) {
      alert(`Ошибка при создании заказа: ${orderError}`);
    }
  }, [orderError]);

  return (
    <section className={`${styles.burger_constructor} pr-4 pl-4 pb-5`} ref={dropRef}>
      {showOrderModal && orderNumber && (
        <Modal onClose={closeOrderDetails}>
          <OrderDetails orderId={orderNumber} />
        </Modal>
      )}
      <ul className={styles.constructor_wrapper}>
        {bun ? (
          <li className={`${styles.constructor_item}`}>
            <ConstructorElement
              type="top"
              isLocked
              text={`${bun.name} (верх)`}
              thumbnail={bun.image_mobile}
              price={bun.price}
            />
          </li>
        ) : (
          <li className={`${styles.constructor_item} ${styles.bun_placeholder}`}>
            <span className="text text_type_main-default">Выберите булку</span>
          </li>
        )}

        <li className={styles.ingredients_container}>
          {ingredients.length > 0 ? (
            ingredients.map((ingredient, index) => (
              <DraggableConstructorItem
                key={ingredient.uniqueId}
                ingredient={ingredient}
                index={index}
              />
            ))
          ) : (
            <div className={styles.ingredients_placeholder}>
              <span className="text text_type_main-default">Выберите начинку</span>
            </div>
          )}
        </li>

        {bun ? (
          <li className={`${styles.constructor_item}`}>
            <ConstructorElement
              type="bottom"
              isLocked
              text={`${bun.name} (низ)`}
              thumbnail={bun.image_mobile}
              price={bun.price}
            />
          </li>
        ) : (
          <li className={`${styles.constructor_item} ${styles.bun_placeholder}`}>
            <span className="text text_type_main-default">Выберите булку</span>
          </li>
        )}
      </ul>
      <div className={styles.constructor_order}>
        <div className={styles.constructor_price}>
          <span className="text text_type_digits-medium">{totalPrice}</span>
          <CurrencyIcon className={styles.currency_icon} type="primary" />
        </div>
        <Button
          size="large"
          htmlType="submit"
          disabled={!canOrder || orderLoading}
          onClick={handleOrder}
        >
          {orderLoading ? <Preloader /> : 'Оформить заказ'}
        </Button>
      </div>
    </section>
  );
};
