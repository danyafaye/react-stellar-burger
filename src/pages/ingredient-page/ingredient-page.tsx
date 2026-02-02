import IngredientDetails from '@components/ingredient-details/ingredient-details.tsx';

import styles from './ingredient-page.module.css';

export const IngredientPage = () => {
  return (
    <div className={styles.container}>
      <h1 className="text text_type_main-large mt-30">Детали ингредиента</h1>
      <IngredientDetails />
    </div>
  );
};
