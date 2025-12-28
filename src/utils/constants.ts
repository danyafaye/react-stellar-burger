export const baseUrl = 'https://norma.education-services.ru/api';

export const DND_TYPES = {
  INGREDIENT: 'ingredient',
  CONSTRUCTOR_INGREDIENT: 'constructor_ingredient',
} as const;

export type DndType = (typeof DND_TYPES)[keyof typeof DND_TYPES];
