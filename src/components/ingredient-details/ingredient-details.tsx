import { Image } from '@components/image/image.tsx';
import { Modal } from '@components/modal/modal.tsx';

import type { TIngredient } from '@utils/types.ts';
import type { FC } from 'react';

import styles from './ingredient-details.module.css';

type IngredientDetailsProps = {
  onClose: () => void;
  ingredient: TIngredient;
};

const IngredientDetails: FC<IngredientDetailsProps> = ({ onClose, ingredient }) => {
  return (
    <Modal onClose={onClose} title="Детали ингредиента">
      <section className={styles.container}>
        <Image className="mb-4" src={ingredient.image_large} width={480} height={240} />
        <h2 className={`${styles.info_text} text text_type_main-medium mb-8`}>
          {ingredient.name}
        </h2>
        <ul className={styles.info_container}>
          <li className={styles.info_block}>
            <span className={`${styles.info_text} text text_type_main-default`}>
              Калории, ккал
            </span>
            <span className={`${styles.info_text} text text_type_digits-default`}>
              {ingredient.calories}
            </span>
          </li>
          <li className={styles.info_block}>
            <span className={`${styles.info_text} text text_type_main-default`}>
              Белки, г
            </span>
            <span className={`${styles.info_text} text text_type_digits-default`}>
              {ingredient.proteins}
            </span>
          </li>
          <li className={styles.info_block}>
            <span className={`${styles.info_text} text text_type_main-default`}>
              Жиры, г
            </span>
            <span className={`${styles.info_text} text text_type_digits-default`}>
              {ingredient.fat}
            </span>
          </li>
          <li className={styles.info_block}>
            <span className={`${styles.info_text} text text_type_main-default`}>
              Углеводы, г
            </span>
            <span className={`${styles.info_text} text text_type_digits-default`}>
              {ingredient.carbohydrates}
            </span>
          </li>
        </ul>
      </section>
    </Modal>
  );
};

export default IngredientDetails;
