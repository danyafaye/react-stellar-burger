import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { useGetIngredients } from '@hooks/useGetIngredients.ts';

import type { TIngredient } from '@utils/types.ts';

import styles from './app.module.css';

export const App = () => {
  const { ingredients, loading } = useGetIngredients();
  const [order, setOrder] = useState<TIngredient[]>([]);

  useEffect(() => {
    if (ingredients) {
      const bun = ingredients.filter((it) => it.type === 'bun');
      const sauces = ingredients.filter((it) => it.type === 'sauce');
      const main = ingredients.filter((it) => it.type === 'main');
      setOrder([bun[0], sauces[0], main[2], main[2], main[3], main[5], bun[0]]); //временная заглушка для данных
    }
  }, [ingredients]);

  return (
    <BrowserRouter>
      <div className={styles.app}>
        <AppHeader />
        <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
          Соберите бургер
        </h1>
        <main className={`${styles.main} pl-5 pr-5`}>
          <BurgerIngredients ingredients={ingredients} order={order} loading={loading} />
          <BurgerConstructor order={order} />
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
