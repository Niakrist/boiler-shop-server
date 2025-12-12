import { ApiProperty } from '@nestjs/swagger';
import { IShoppingCart } from 'src/shopping-cart/types';

export class LoginUserRequest {
  @ApiProperty({ example: 'user1' })
  username: string;

  @ApiProperty({ example: '123456' })
  password: string;
}

export class LoginUserResponse {
  @ApiProperty({
    example: {
      userId: 'cmisvyp520000ygovfkm556t3',
      username: 'user1',
      email: '1@mail.ru',
    },
  })
  user: {
    userId: string;
    username: string;
    email: string;
  };

  @ApiProperty({ example: 'Logged in' })
  msg: string;
}

// LogoutUserRequest нам не нужен
class LogoutUserRequest {}

export class LogoutUserResponse {
  @ApiProperty({ example: 'session has ended' })
  msg: string;
}

export class LoginCheckUserResponse {
  @ApiProperty({ example: 'cmisvyp520000ygovfkm556t3' })
  userId: string;

  @ApiProperty({ example: 'user1' })
  username: string;

  @ApiProperty({ example: '1@mail.ru' })
  email: string;
}

// Нам не нужен, это описывается в create-user.dto.ts
class SignUpUserRequest {}

export class SignUpUserResponse {
  @ApiProperty({ example: 'cmisvyp520000ygovfkm556t3' })
  id: string;

  @ApiProperty({ example: '2025-12-09T12:44:21.856Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-12-09T12:44:21.856Z' })
  updatedAt: string;

  @ApiProperty({ example: 'user1' })
  username: string;

  @ApiProperty({ example: '2@mail.ru' })
  email: string;

  @ApiProperty({ example: '$argon2id$v=19$m=65536' })
  password: string;
}

export interface IUser {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  email: string;
  password: string;
  shoppingCart: IShoppingCart;
}
