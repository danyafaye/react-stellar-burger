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

export type TWSOrder = {
  ingredients: string[];
  _id: string;
  status: 'created' | 'pending' | 'done';
  number: number;
  createdAt: string;
  updatedAt: string;
  name: string;
};

export type TWSResponse = {
  success: boolean;
  orders: TWSOrder[];
  total: number;
  totalToday: number;
};

export type TOrderIngredients = {
  imgSrc: string;
  id: string;
  name: string;
  price: number;
  count: number;
  uniqueId: string;
};

export type TOrderInfo = {
  number: number;
  date: string;
  name: string;
  cost: number;
  status: TWSOrder['status'];
  ingredients: TOrderIngredients[];
};
