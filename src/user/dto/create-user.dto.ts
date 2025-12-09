import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class CreateUserDto {
  @ApiProperty({ example: 'user1' })
  @IsNotEmpty()
  @IsString({ message: 'Имя обязательное поле' })
  username: string;

  @ApiProperty({ example: '1@mail.ru' })
  @IsNotEmpty()
  @IsString({
    message: 'Почта обязательное поле',
  })
  email: string;

  @ApiProperty({ example: '123465' })
  @IsNotEmpty()
  @IsString({ message: 'Пароль обязательное поле' })
  password: string;
}
