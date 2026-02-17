export const BASE_URL = 'https://norma.education-services.ru/api';
export const WS_URL_ALL = 'wss://norma.education-services.ru/orders/all';

export const DND_TYPES = {
  INGREDIENT: 'ingredient',
  CONSTRUCTOR_INGREDIENT: 'constructor_ingredient',
} as const;

export const statusesInfo = {
  done: {
    text: 'Выполнен',
    color: 'var(--colors-interface-success)',
  },
  pending: {
    text: 'Готовится',
    color: '',
  },
  created: {
    text: 'Создан',
    color: '',
  },
};

export type DndType = (typeof DND_TYPES)[keyof typeof DND_TYPES];
