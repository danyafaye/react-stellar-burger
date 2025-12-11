import { Preloader, Tab } from '@krgaa/react-developer-burger-ui-components';
import { useState, type FC, useMemo, useRef, useEffect, useCallback } from 'react';

import IngredientDetails from '@components/ingredient-details/ingredient-details.tsx';
import IngredientItem from '@components/ingredient-item/ingredient-item.tsx';

import type { TIngredient } from '@utils/types.ts';

import styles from './burger-ingredients.module.css';

type BurgerIngredientsProps = {
  ingredients: TIngredient[];
  order: TIngredient[];
  loading: boolean;
};

type IngredientType = 'bun' | 'sauce' | 'main';

export const BurgerIngredients: FC<BurgerIngredientsProps> = ({
  ingredients,
  order,
  loading,
}) => {
  const [activeTab, setActiveTab] = useState<IngredientType>('bun');

  const [ingredientInfo, setIngredientInfo] = useState<TIngredient | null>(null);

  const bunsRef = useRef<HTMLDivElement>(null);
  const saucesRef = useRef<HTMLDivElement>(null);
  const mainsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTabClick = (tab: IngredientType) => {
    setActiveTab(tab);
    const refMap = { bun: bunsRef, sauce: saucesRef, main: mainsRef };
    refMap[tab].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    if (loading) return;

    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

        if (!entry) return;

        const id = entry.target.getAttribute('data-type') as IngredientType;
        if (id) setActiveTab(id);
      },
      {
        root: container,
        threshold: 0.01,
        rootMargin: '-10% 0px -80% 0px',
      }
    );

    [bunsRef.current, saucesRef.current, mainsRef.current]
      .filter(Boolean)
      .forEach((el) => observer.observe(el as Element));

    return () => observer.disconnect();
  }, [loading, ingredients.length]);

  const onOpenIngredientModals = (ingredient: TIngredient) => {
    setIngredientInfo(ingredient);
  };

  const onCloseIngredientDetails = () => {
    setIngredientInfo(null);
  };

  const getOrderCount = useCallback(
    (itemId: string, isBun?: boolean) => {
      if (isBun) {
        return order.find((it) => it?._id === itemId) ? 1 : 0;
      }
      return order.filter((it) => it?._id === itemId).length;
    },
    [order]
  );

  const renderBuns = useMemo(() => {
    return (
      <div ref={bunsRef} data-type="bun" className={styles.ingredients_wrapper}>
        <h2 className="text text_type_main-medium">Булки</h2>

        <ul className={styles.ingredients}>
          {ingredients
            .filter((item) => item.type === 'bun')
            .map((item) => {
              const count = getOrderCount(item._id, true);
              return (
                <IngredientItem
                  key={item._id}
                  count={count}
                  ingredient={item}
                  onClick={() => onOpenIngredientModals(item)}
                />
              );
            })}
        </ul>
      </div>
    );
  }, [ingredients, order]);

  const renderSauces = useMemo(() => {
    return (
      <div ref={saucesRef} data-type="sauce" className={styles.ingredients_wrapper}>
        <h2 className="text text_type_main-medium">Соусы</h2>

        <ul className={styles.ingredients}>
          {ingredients
            .filter((item) => item.type === 'sauce')
            .map((item) => {
              const count = getOrderCount(item._id);
              return (
                <IngredientItem
                  key={item._id}
                  count={count}
                  ingredient={item}
                  onClick={() => onOpenIngredientModals(item)}
                />
              );
            })}
        </ul>
      </div>
    );
  }, [ingredients, order]);

  const renderMain = useMemo(() => {
    return (
      <div ref={mainsRef} data-type="main" className={styles.ingredients_wrapper}>
        <h2 className="text text_type_main-medium">Начинки</h2>

        <ul className={styles.ingredients}>
          {ingredients
            .filter((item) => item.type === 'main')
            .map((item) => {
              const count = getOrderCount(item._id);
              return (
                <IngredientItem
                  key={item._id}
                  count={count}
                  ingredient={item}
                  onClick={() => onOpenIngredientModals(item)}
                />
              );
            })}
        </ul>
      </div>
    );
  }, [ingredients, order]);

  if (loading) {
    return <Preloader />;
  }

  return (
    <section className={styles.burger_ingredients}>
      {ingredientInfo && (
        <IngredientDetails
          ingredient={ingredientInfo}
          onClose={onCloseIngredientDetails}
        />
      )}
      <nav>
        <ul className={styles.menu}>
          <Tab
            value="bun"
            active={activeTab === 'bun'}
            onClick={() => handleTabClick('bun')}
          >
            Булки
          </Tab>
          <Tab
            value="sauce"
            active={activeTab === 'sauce'}
            onClick={() => handleTabClick('sauce')}
          >
            Соусы
          </Tab>
          <Tab
            value="main"
            active={activeTab === 'main'}
            onClick={() => handleTabClick('main')}
          >
            Начинки
          </Tab>
        </ul>
      </nav>
      <div className={styles.overflow_container} ref={containerRef}>
        {renderBuns}
        {renderSauces}
        {renderMain}
      </div>
    </section>
  );
};
