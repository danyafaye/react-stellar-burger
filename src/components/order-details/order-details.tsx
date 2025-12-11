import { Image } from '@components/image/image.tsx';
import { Modal } from '@components/modal/modal.tsx';
import doneImage from '@images/done.png';

import type { FC } from 'react';

import styles from './order-details.module.css';

type OrderDetailsProps = {
  orderId: string;
  onClose: () => void;
};

const OrderDetails: FC<OrderDetailsProps> = ({ onClose, orderId }) => {
  return (
    <Modal onClose={onClose}>
      <section className={styles.container}>
        <div className={styles.order_id}>
          <h1 className="text text_type_digits-large">{orderId}</h1>
          <span className="text text_type_main-medium">идентификатор заказа</span>
        </div>
        <Image src={doneImage} width={120} height={120} />
        <div className={`${styles.order_description} pb-15`}>
          <span className="text text_type_main-default">Ваш заказ начали готовить</span>
          <span className="text text_type_main-default text_color_inactive">
            Дождитесь готовности на орбитальной станции
          </span>
        </div>
      </section>
    </Modal>
  );
};

export default OrderDetails;
