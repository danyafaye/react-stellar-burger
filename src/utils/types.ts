export type TIngredient = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
  __v: number;
};

export type ResponseType<T> = {
  success: boolean;
  data: T[];
};

export type TOrder = {
  name: string;
  order: {
    number: number;
  };
  success: boolean;
};

export type TCreateOrderRequest = {
  ingredients: string[];
};
