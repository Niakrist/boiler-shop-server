import type { INestApplication } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma.service';
import request from 'supertest';
import argon2 from 'argon2';

const mockedUser = {
  username: 'mosk',
  email: 'mosk@test.ru',
  password: 'mosk123',
};

describe('Users controller', () => {
  let app: INestApplication;
  let userService: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      imports: [UserModule, ConfigModule.forRoot()],
    }).compile();

    app = testModule.createNestApplication();

    userService = testModule.get<UserService>(UserService);
    prisma = testModule.get<PrismaService>(PrismaService);

    await app.init();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
    const user = await userService.create(mockedUser);
    expect(user).toBeDefined();
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('should create user', async () => {
    const newUser = {
      username: 'test',
      email: 'test@test.ru',
      password: 'test123',
    };

    const response = await request(app.getHttpServer())
      .post('/users/signup')
      .send(newUser);
    const passwordIsValid = await argon2.verify(
      response.body.password,
      newUser.password,
    );

    expect(response.body.username).toBe(newUser.username);
    expect(passwordIsValid).toBe(true);
    expect(response.body.email).toBe(newUser.email);
  });
});
