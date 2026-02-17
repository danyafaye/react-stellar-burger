import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useMemo, type FC } from 'react';

import { statusesInfo } from '@utils/constants.ts';

import type { TOrderInfo } from '@utils/types.ts';

import styles from './order-block.module.css';

type OrderBlockProps = {
  orderInfo: TOrderInfo;
  onClick: () => void;
  showStatus?: boolean;
};

export const OrderBlock: FC<OrderBlockProps> = ({ orderInfo, onClick, showStatus }) => {
  const { name, number, date, cost, ingredients } = orderInfo;

  const restIngredientsNumber = useMemo(
    () => ingredients.length - 5,
    [ingredients.length]
  );

  const renderIngredients = useMemo(() => {
    return ingredients.map((it, index, array) => {
      const isFullItems = index === 4 && restIngredientsNumber > 0;
      if (index <= 4) {
        return (
          <div
            key={it.uniqueId}
            className={styles.ingredientWrapper}
            style={{
              transform: `translateX(${index * -15}px)`,
              zIndex: array.length - index,
            }}
          >
            <img
              className={styles.ingredient}
              src={it.imgSrc}
              alt="ingredient-img"
              style={{
                opacity: isFullItems ? 0.25 : 1,
              }}
            />
            {isFullItems && (
              <span className={`${styles.restNumber} text text_type_main-default`}>
                +{restIngredientsNumber}
              </span>
            )}
          </div>
        );
      }
    });
  }, [ingredients, restIngredientsNumber]);

  return (
    <article onClick={onClick} className={`${styles.container} p-6`}>
      <div className={styles.orderInfo}>
        <p className="text text_type_digits-default">#{number}</p>
        <p className="text text_type_main-default text_color_inactive">{date}</p>
      </div>
      <div className={styles.nameInfo}>
        <h3 className="text text_type_main-medium">{name}</h3>
        {showStatus && (
          <span
            className={`text text_type_main-default`}
            style={{ color: statusesInfo[orderInfo.status].color }}
          >
            {statusesInfo[orderInfo.status].text}
          </span>
        )}
      </div>
      <section className={styles.ingredientsBlock}>
        <div className={styles.ingredients}>{renderIngredients}</div>
        <div className={styles.orderPrice}>
          <span className="text text_type_digits-default">{cost}</span>
          <CurrencyIcon type="primary" />
        </div>
      </section>
    </article>
  );
};
