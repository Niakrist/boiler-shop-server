import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async validateUser(username: string, password: string) {
    const user = await this.userService.findOne(username);

    if (!user) {
      throw new UnauthorizedException('username invalid');
    }

    const passwordValid = await argon2.verify(user.password, password);

    if (!passwordValid) {
      throw new UnauthorizedException('password invalid');
    }
    if (user && password) {
      return {
        userId: user.id,
        username: user.username,
        email: user.email,
      };
    }
    return null;
  }
}
