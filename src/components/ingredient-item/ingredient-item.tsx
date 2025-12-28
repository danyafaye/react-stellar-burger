import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { type FC, useRef } from 'react';
import { useDrag } from 'react-dnd';

import { Image } from '@components/image/image.tsx';
import { DND_TYPES } from '@utils/constants.ts';

import type { TIngredient } from '@utils/types.ts';

import styles from './ingredient-item.module.css';

type IngredientItemProps = {
  ingredient: TIngredient;
  onClick: () => void;
  count: number;
};

type DragCollectedProps = {
  isDragging: boolean;
};

const IngredientItem: FC<IngredientItemProps> = ({ ingredient, onClick, count }) => {
  const dragRef = useRef<HTMLLIElement>(null);

  const [{ isDragging }, drag] = useDrag<TIngredient, void, DragCollectedProps>({
    type: DND_TYPES.INGREDIENT,
    item: ingredient,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(dragRef);

  return (
    <li
      ref={dragRef}
      className={`${styles.block} ${isDragging ? styles.dragging : ''}`}
      onClick={onClick}
    >
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
