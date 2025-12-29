import { ConfigModule } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import session from 'express-session';
import passport from 'passport';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma.service';
import {
  LoginCheckUserResponse,
  LoginUserResponse,
  LogoutUserResponse,
} from 'src/user/types';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import request from 'supertest';

// e2e test

// Тестовые данные пользователя
const mockedUser = {
  username: 'mock_controller',
  email: 'mock_controller@test.ru',
  password: 'mock_123',
};

describe('Auth controller', () => {
  // Экземпляр приложения
  let app: NestExpressApplication;
  // Сервис пользователей
  let userService: UserService;
  //Сервис для работы с БД
  let prisma: PrismaService;

  // Перед КАЖДЫМ тестом создает "чистое" тестовое окружение

  beforeEach(async () => {
    // Создается тестовый модуль с AuthModule и UserModule
    const testModule: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, UserModule, ConfigModule.forRoot()],
    }).compile();

    prisma = testModule.get<PrismaService>(PrismaService);

    userService = testModule.get<UserService>(UserService);

    app = testModule.createNestApplication<NestExpressApplication>();

    // Без этой конфигурации аутентификация через сессии не будет работать.
    app.use(
      session({
        secret: '12345', // Секретный ключ для подписи cookie
        resave: false, // Не пересохранять сессию, если она не изменилась
        saveUninitialized: false, // Не сохранять пустые сессии (GDPR-совместимость: не создавать сессию, пока пользователь не залогинится)
      }),
    );
    app.use(passport.initialize());
    app.use(passport.session());
    await app.init();
    // Очищает таблицу пользователей
    await prisma.user.deleteMany();
    // Создает тестового пользователя
    const user = await userService.create(mockedUser);
    // Проверяет, что пользователь создан
    expect(user).toBeDefined();
  });

  // После КАЖДОГО теста очищает базу данных, чтобы тесты не влияли друг на друга (изоляция тестов).
  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  // После ВСЕХ тестов выполняет cleanup
  afterAll(async () => {
    // Закрывает приложение
    await app.close();
    // Разрывает соединение с БД
    await prisma.$disconnect();
  });

  // Тест логина
  it('should login user', async () => {
    const response = await request(app.getHttpServer())
      .post('/users/login')
      .send({
        username: mockedUser.username,
        password: mockedUser.password,
      })
      .expect(200);

    // Типизация ответа
    const responseBody = response.body as LoginUserResponse;

    // Проверки
    expect(responseBody.user.username).toBe(mockedUser.username);
    expect(responseBody.user.email).toBe(mockedUser.email);
    expect(responseBody.msg).toBe('Logged in');
  });

  it('should login check', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    const loginCheck = await request(app.getHttpServer())
      .get('/users/login-check')
      .set('Cookie', login.headers['set-cookie']);

    const loginCheckBody = loginCheck.body as LoginCheckUserResponse;

    expect(loginCheckBody.username).toBe(mockedUser.username);
    expect(loginCheckBody.email).toBe(mockedUser.email);
  });

  it('should logout', async () => {
    const response = await request(app.getHttpServer()).get('/users/logout');

    const responseBody = response.body as LogoutUserResponse;

    expect(responseBody.msg).toBe('session has ended');
  });
});
