import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LocalAuthGuard } from 'src/auth/guards/local.auth.guard';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  @Header('Content-type', 'application/json')
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @Header('Content-type', 'application/json')
  async login(@Request() req) {
    return { user: req.user, msg: 'Logged in' };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/login-check')
  async loginCheck(@Request() req) {
    return req.user;
  }

  @Get('/logout')
  async logout(@Request() req) {
    req.session.destroy();
    return { msg: 'session has ended' };
  }
}
