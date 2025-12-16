import { ApiProperty } from '@nestjs/swagger';
import { BoilerPart } from 'src/boiler-part/types';
import { IUser } from 'src/user/types';

export interface IShoppingCart {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: IUser;
  items: IShoppingCartItem[];
}

export interface IShoppingCartItem {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  cartId: string;
  partId: string;
  part: BoilerPart;
  quantity: number;
  priceAtAddition: number;
}

class CartItem implements IShoppingCartItem {
  @ApiProperty({ example: 'cmizx1v870000ykv4emwf7csx' })
  id: string;

  @ApiProperty({ example: '2025-12-10T11:18:42.775Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-12-10T11:18:42.775Z' })
  updatedAt: Date;

  @ApiProperty({ example: 'cmizx1v870000ykv4emwf7csx' })
  cartId: string;

  @ApiProperty({ example: 'cmizx1v870000ykv4emwf7csx' })
  partId: string;

  @ApiProperty({ type: BoilerPart })
  part: BoilerPart;

  @ApiProperty({ example: 10 })
  quantity: number;

  @ApiProperty({ example: 18500 })
  priceAtAddition: number;
}

class Cart {
  @ApiProperty({ example: 'cmizx1v870000ykv4emwf7csx' })
  id: string;

  @ApiProperty({ example: '2025-12-10T11:18:42.775Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-12-10T11:18:42.775Z' })
  updatedAt: Date;

  @ApiProperty({ example: 'cmizx1v870000ykv4emwf7csx' })
  userId: string;

  @ApiProperty({ type: CartItem, isArray: true })
  items: CartItem[];
}

export class CartResponse extends Cart {}

export class CartAddResponse extends Cart {}

export class CartUpdateResponse extends Cart {}

export class CartDeleteResponse {
  @ApiProperty({ example: 'cmj2up3bd0000zgovcufbb1vo' })
  id: string;

  @ApiProperty({ example: '2025-12-12T12:36:06.016Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-12-12T12:36:06.016Z' })
  updatedAt: Date;

  @ApiProperty({ example: 'cmj2r6vw60000psovteg2fsxh' })
  cartId: string;

  @ApiProperty({ example: 'cmj2ly0ab001hv4ov6427ronj' })
  partId: string;

  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiProperty({ example: 18633 })
  priceAtAddition: number;
}

export class CartClearResponse {
  @ApiProperty({ example: 1 })
  count: number;
}
