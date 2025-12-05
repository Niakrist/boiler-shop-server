import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(identifier: string) {
    // Ищем пользователя по id или email
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { id: identifier },
          { email: identifier },
          { username: identifier },
        ],
      },
    });
    return user;
  }

  async create(dto: CreateUserDto) {
    const isExistUser = await this.findOne(dto.email || dto.username);
    if (isExistUser) {
      throw new BadRequestException('Пользователь уже существует');
    }

    const hashPassword = await argon2.hash(dto.password);

    return this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        password: hashPassword,
      },
    });
  }
}
