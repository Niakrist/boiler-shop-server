import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/pagination/dto/pagination.dto';

export class GetAllBoilerPartGto extends PaginationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  // @IsNumber({}, { message: 'Цена должна быть числом' })
  // @IsNotEmpty({ message: 'Цена не может быть пустой' })
  // price?: number;

  // @IsString({ message: 'Бренд обязателен' })
  // @IsNotEmpty({ message: 'Бренд не может быть пустым' })
  // boilerManufacturer?: string;

  // @IsString({ message: 'Запчасть обязательна' })
  // @IsNotEmpty({ message: 'Запчасть не может быть пустой' })
  // partsManufacturer?: string;

  // @IsString({ message: 'Вендер код обязателен' })
  // @IsNotEmpty({ message: 'Вендер код не может быть пустом' })
  // venderCode?: string;

  // @ArrayMinSize(1, { message: 'Должна быть хотя бы одна картинка' })
  // @IsNotEmpty({
  //   each: true, // Валидация к КАЖДОМУ элементу массива отдельно, проверяет, что КАЖДЫЙ элемент массива не пуст
  //   message: 'Путь к картинке не может быть пустым',
  // })
  // images?: string[];

  // @IsNumber()
  // inStock?: number;

  // @IsBoolean()
  // bestseller: boolean;

  // @IsBoolean()
  // newBoilerPart: boolean;

  // @IsNumber()
  // popularity: number;

  // @IsString()
  // compatibility: string;
}
