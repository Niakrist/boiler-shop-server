import { IUser } from 'src/user/types';

export interface IShoppingCart {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: IUser;
  items: IShoppingCartItem[];
}

export interface IShoppingCartItem {}
