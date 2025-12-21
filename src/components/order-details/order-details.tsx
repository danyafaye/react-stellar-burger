import { Image } from '@components/image/image.tsx';
import doneImage from '@images/done.png';

import type { FC } from 'react';

import styles from './order-details.module.css';

type OrderDetailsProps = {
  orderId: string;
};

const OrderDetails: FC<OrderDetailsProps> = ({ orderId }) => {
  return (
    <section className={styles.container}>
      <div className={styles.order_id}>
        <h1 className="text text_type_digits-large">{orderId}</h1>
        <span className="text text_type_main-medium">идентификатор заказа</span>
      </div>
      <Image src={doneImage} width={120} height={120} alt="order_done" />
      <div className={`${styles.order_description} pb-15`}>
        <span className="text text_type_main-default">Ваш заказ начали готовить</span>
        <span className="text text_type_main-default text_color_inactive">
          Дождитесь готовности на орбитальной станции
        </span>
      </div>
    </section>
  );
};

export default OrderDetails;
