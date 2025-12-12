import { IBoilerPart } from 'src/boiler-part/types';
import { IShoppingCart } from '../types';

export class ShoppingCartItemDto {
  part: IBoilerPart;
  cart: IShoppingCart;
  cartId: string;
  partId: string;
  quantity: number;
  priceAtAddition: number;
}
