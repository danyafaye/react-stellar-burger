import { useParams } from 'react-router-dom';

import { Image } from '@components/image/image.tsx';
import { useAppSelector } from '@hooks/useAppSelector.ts';
import { selectIngredients } from '@services/ingredients/selectors.ts';

import type { FC } from 'react';

import styles from './ingredient-details.module.css';

const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const ingredients = useAppSelector(selectIngredients);

  const ingredient = ingredients.find((item) => item._id === id);

  if (!ingredient) {
    return null;
  }

  return (
    <section className={styles.container}>
      <Image
        className="mb-4"
        src={ingredient.image_large}
        alt="ingredient_image"
        width={480}
        height={240}
      />
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
  );
};

export default IngredientDetails;
