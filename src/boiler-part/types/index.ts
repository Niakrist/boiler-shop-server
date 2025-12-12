import { ApiProperty } from '@nestjs/swagger';

export interface IBoilerPart {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string;
  price: number;
  boilerManufacturer: string;
  partsManufacturer: string;
  venderCode: string;
  images: string[];
  inStock: number;
  bestseller: boolean;
  newBoilerPart: boolean;
  popularity: number;
  compatibility: string;
}

// Все товары
export class BoilerPart {
  @ApiProperty({ example: 'cmizx1v870000ykv4emwf7csx' })
  id: string;

  @ApiProperty({ example: '2025-12-10T11:18:42.775Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-12-10T11:18:42.775Z' })
  updatedAt: Date;

  @ApiProperty({ example: 'Henry Pauci verumtamen.' })
  name: string;

  @ApiProperty({
    example:
      '"Henry Combibo aperio arbitro repudiandae balbus adfero charisma torrens commemoro cuppedia.',
  })
  description: string;

  @ApiProperty({ example: 8860 })
  price: number;

  @ApiProperty({ example: 'Henry' })
  boilerManufacturer: string;

  @ApiProperty({ example: 'Gloves' })
  partsManufacturer: string;

  @ApiProperty({ example: 'GURJHNC6QN' })
  venderCode: string;

  @ApiProperty({
    example: [
      'https://loremflickr.com/640/480/technics?lock=5828369406380316',
      'https://loremflickr.com/640/480/technics?lock=7736923681148256',
      'https://loremflickr.com/640/480/technics?lock=8069771178274966',
    ],
  })
  images: string[];

  @ApiProperty({ example: 91 })
  inStock: number;

  @ApiProperty({ example: false })
  bestseller: boolean;

  @ApiProperty({ example: true })
  newBoilerPart: boolean;

  @ApiProperty({ example: 15 })
  popularity: number;

  @ApiProperty({
    example: 'Balbus suscipit degero utique ducimus deporto tondeo.',
  })
  compatibility: string;
}

//  Ответ: все товары + пагинация
export class PaginatedAndFilterResponse {
  @ApiProperty({ example: 10 })
  count: number;

  @ApiProperty({ type: BoilerPart, isArray: true })
  data: BoilerPart;
}

// Все бестселлеры
export class Bestseller extends BoilerPart {
  @ApiProperty({
    description: 'Все продукты в этом списке являются бестселлерами',
    example: true,
  })
  declare bestseller: boolean;
}

// Ответ: все бестселлеры + пагинация
export class GetBestsellersResponse extends PaginatedAndFilterResponse {
  @ApiProperty({ example: 10 })
  declare count: number;

  @ApiProperty({ type: Bestseller, isArray: true })
  declare data: Bestseller;
}

// Все новинками
export class NewBoilerPart extends BoilerPart {
  @ApiProperty({
    description: 'Все продукты в этом списке являются новинками',
    example: true,
  })
  declare newBoilerPart: boolean;
}

//Ответ: все новинками + пагинация
export class GetNewsResponse extends PaginatedAndFilterResponse {
  @ApiProperty({ example: 10 })
  declare count: number;

  @ApiProperty({ type: NewBoilerPart, isArray: true })
  declare data: NewBoilerPart;
}

// Ответ Поиск одного товара по полю name
export class FindByNameResponse extends BoilerPart {}

// Запрос: поиск одного товара по полю name
export class FindByNameRequest {
  @ApiProperty({ example: 'Henry Pauci verumtamen.' })
  name: string;
}

export class SearcByLetter extends BoilerPart {
  @ApiProperty({ example: 'ver' })
  declare name: string;
}

// Ответ: все из поиска по тексту
export class SearchResponse extends PaginatedAndFilterResponse {
  @ApiProperty({ type: SearcByLetter, isArray: true })
  declare data: SearcByLetter;
}

// Запрос: поиск по тексту
export class SearchRequet {
  @ApiProperty({ example: 'ver' })
  searchTerm: string;
}
// Ответ: один товар по id
export class FindByIdResponse extends BoilerPart {}

// Запрос: один товар по id
export class FindByIdRequest {
  @ApiProperty({ example: 'cmizx1v870000ykv4emwf7csx' })
  id: string;
}
