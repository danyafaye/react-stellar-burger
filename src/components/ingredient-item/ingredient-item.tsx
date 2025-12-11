import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';

import { Image } from '@components/image/image.tsx';

import type { TIngredient } from '@utils/types.ts';
import type { FC } from 'react';

import styles from './ingredient-item.module.css';

type IngredientItemProps = {
  ingredient: TIngredient;
  onClick: () => void;
  count: number;
};

const IngredientItem: FC<IngredientItemProps> = ({ ingredient, onClick, count }) => {
  return (
    <li className={styles.block} onClick={onClick}>
      {count > 0 && <Counter count={count} />}
      <Image
        width={240}
        height={120}
        srcSet={`${ingredient.image_mobile} 0.5x, ${ingredient.image_large} 2x`}
        src={ingredient.image}
        alt="ingredient_image"
      />
      <div className={styles.price}>
        <span className="text text_type_digits-default">{ingredient.price}</span>
        <CurrencyIcon type="primary" />
      </div>
      <span className={styles.name}>{ingredient.name}</span>
    </li>
  );
};

export default IngredientItem;
