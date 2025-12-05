import { Body, Controller, Header, HttpCode, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(200)
  @Post('/signup')
  @Header('Content-type', 'application/json')
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }
}
