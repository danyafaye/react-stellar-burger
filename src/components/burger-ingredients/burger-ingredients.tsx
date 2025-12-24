import { Preloader, Tab } from '@krgaa/react-developer-burger-ui-components';
import { useState, type FC, useMemo, useRef, useEffect } from 'react';

import IngredientDetails from '@components/ingredient-details/ingredient-details.tsx';
import IngredientItem from '@components/ingredient-item/ingredient-item.tsx';
import { Modal } from '@components/modal/modal.tsx';
import { useAppDispatch } from '@hooks/useAppDispatch.ts';
import { useAppSelector } from '@hooks/useAppSelector.ts';
import {
  selectCurrentIngredient,
  selectIngredients,
  selectIngredientsLoading,
} from '@services/ingredients/selectors.ts';
import {
  clearCurrentIngredient,
  setCurrentIngredient,
} from '@services/ingredients/slice.ts';
import { selectIngredientCounts } from '@services/order/selectors.ts';

import type { TIngredient } from '@utils/types.ts';

import styles from './burger-ingredients.module.css';

type IngredientType = 'bun' | 'sauce' | 'main';

export const BurgerIngredients: FC = () => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<IngredientType>('bun');
  const ingredients = useAppSelector(selectIngredients);
  const loading = useAppSelector(selectIngredientsLoading);
  const ingredientCounts = useAppSelector(selectIngredientCounts);
  const currentIngredient = useAppSelector(selectCurrentIngredient);

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

  const handleIngredientClick = (ingredient: TIngredient) => {
    dispatch(setCurrentIngredient(ingredient));
  };

  const handleCloseModal = () => {
    dispatch(clearCurrentIngredient());
  };

  const renderBuns = useMemo(() => {
    return (
      <div ref={bunsRef} data-type="bun" className={styles.ingredients_wrapper}>
        <h2 className="text text_type_main-medium">Булки</h2>

        <ul className={styles.ingredients}>
          {ingredients
            .filter((item) => item.type === 'bun')
            .map((item) => {
              const count = ingredientCounts[item._id] || 0;
              return (
                <IngredientItem
                  key={item._id}
                  count={count}
                  ingredient={item}
                  onClick={() => handleIngredientClick(item)}
                />
              );
            })}
        </ul>
      </div>
    );
  }, [ingredients, ingredientCounts]);

  const renderSauces = useMemo(() => {
    return (
      <div ref={saucesRef} data-type="sauce" className={styles.ingredients_wrapper}>
        <h2 className="text text_type_main-medium">Соусы</h2>

        <ul className={styles.ingredients}>
          {ingredients
            .filter((item) => item.type === 'sauce')
            .map((item) => {
              const count = ingredientCounts[item._id] || 0;
              return (
                <IngredientItem
                  key={item._id}
                  count={count}
                  ingredient={item}
                  onClick={() => handleIngredientClick(item)}
                />
              );
            })}
        </ul>
      </div>
    );
  }, [ingredients, ingredientCounts]);

  const renderMain = useMemo(() => {
    return (
      <div ref={mainsRef} data-type="main" className={styles.ingredients_wrapper}>
        <h2 className="text text_type_main-medium">Начинки</h2>

        <ul className={styles.ingredients}>
          {ingredients
            .filter((item) => item.type === 'main')
            .map((item) => {
              const count = ingredientCounts[item._id] || 0;
              return (
                <IngredientItem
                  key={item._id}
                  count={count}
                  ingredient={item}
                  onClick={() => handleIngredientClick(item)}
                />
              );
            })}
        </ul>
      </div>
    );
  }, [ingredients, ingredientCounts]);

  if (loading) {
    return <Preloader />;
  }

  return (
    <section className={styles.burger_ingredients}>
      {currentIngredient && (
        <Modal onClose={handleCloseModal} title="Детали ингредиента">
          <IngredientDetails />
        </Modal>
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
