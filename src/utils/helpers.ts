import { nanoid } from '@reduxjs/toolkit';

import type {
  TIngredient,
  TOrderInfo,
  TOrderIngredients,
  TWSOrder,
} from '@utils/types.ts';

export const getOrderInfo = (
  order: TWSOrder,
  ingredients: TIngredient[]
): TOrderInfo => {
  return {
    number: order.number,
    ingredients: order.ingredients.reduce(
      (result: TOrderIngredients[], currentValue) => {
        const ingredientCount = order.ingredients.filter(
          (ing) => ing === currentValue
        ).length;
        const ingredientInfo = ingredients.find((ing) => ing._id === currentValue);
        const isIngredientExists = result.find((ing) => ing.id === currentValue);

        if (!isIngredientExists) {
          result.push({
            imgSrc: ingredientInfo?.image ?? '',
            id: ingredientInfo?._id ?? '',
            name: ingredientInfo?.name ?? '',
            price: ingredientInfo?.price ?? 0,
            count: ingredientCount,
            uniqueId: nanoid(),
          });
        }

        return result;
      },
      []
    ),
    cost: order.ingredients.reduce((total, ingredientId) => {
      const ingredient = ingredients.find((ing) => ing._id === ingredientId);
      return ingredient ? total + ingredient.price : total;
    }, 0),
    date: formatOrderDate(order.createdAt),
    name: order.name,
    status: order.status,
  };
};

export const formatOrderDate = (iso: string): string => {
  const date = new Date(iso);
  const now = new Date();

  const startOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const d0 = startOf(date).getTime();
  const t0 = startOf(now).getTime();

  const diffDays = Math.round((d0 - t0) / (1000 * 60 * 60 * 24));

  let dayLabel: string;
  if (diffDays === 0) dayLabel = 'Сегодня';
  else if (diffDays === -1) dayLabel = 'Вчера';
  else {
    const rtf = new Intl.RelativeTimeFormat('ru-RU', { numeric: 'auto' });
    dayLabel = rtf.format(diffDays, 'day');
  }

  const time = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  return `${dayLabel}, ${time}`;
};
