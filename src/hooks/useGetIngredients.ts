import { useEffect, useState } from 'react';

import { baseUrl } from '@utils/constants.ts';

import type { ResponseType, TIngredient } from '@utils/types.ts';

export const useGetIngredients = () => {
  const [ingredients, setIngredients] = useState<TIngredient[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIngredients = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/ingredients`);
      if (!res.ok) {
        throw new Error(`Ошибка: ${res.status}`);
      }
      const data = (await res.json()) as ResponseType<TIngredient>;
      setIngredients(data.data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchIngredients();
  }, []);

  return { ingredients, loading, error };
};
