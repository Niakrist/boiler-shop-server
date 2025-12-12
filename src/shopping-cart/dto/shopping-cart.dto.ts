import { IsDate, IsNumber, IsString } from 'class-validator';

export class ShoppingCartDto {
  @IsString()
  id: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  boilerManufacturer: string;

  @IsString()
  partsManufacturer: string;

  @IsString()
  image: string;

  @IsNumber()
  inStock: number;

  @IsString()
  userId: string;

  @IsString()
  partId: string;

  @IsNumber()
  count: number;

  @IsNumber()
  totalPrice: number;
}
