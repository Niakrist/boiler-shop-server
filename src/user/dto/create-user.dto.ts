import { IsNotEmpty, IsString } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  @IsString({ message: 'Имя обязательное поле' })
  username: string;

  @IsNotEmpty()
  @IsString({
    message: 'Почта обязательное поле',
  })
  email: string;

  @IsNotEmpty()
  @IsString({ message: 'Пароль обязательное поле' })
  password: string;
}
