import type { INestApplication } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma.service';
import request from 'supertest';
import argon2 from 'argon2';

// E2E test

// Тестовые данные пользователя
const mockedUser = {
  username: 'mosk',
  email: 'mosk@test.ru',
  password: 'mosk123',
};

// Определяет тестовый набор для user.controller
describe('Users controller', () => {
  // Экземпляр приложения
  let app: INestApplication;
  // Сервис пользователей
  let userService: UserService;
  //Сервис для работы с БД
  let prisma: PrismaService;

  // Перед КАЖДЫМ тестом создает "чистое" тестовое окружение
  beforeEach(async () => {
    // Создаем тестовый модуль с зависимостями
    const testModule: TestingModule = await Test.createTestingModule({
      imports: [UserModule, ConfigModule.forRoot()],
    }).compile();

    //Создает экземпляр приложения
    app = testModule.createNestApplication();

    // Получаем инстансы сервисов из DI-контейнера
    userService = testModule.get<UserService>(UserService);
    prisma = testModule.get<PrismaService>(PrismaService);

    // Инициализирует приложение
    await app.init();
  });

  // Перед КАЖДЫМ тестом подготавливает базу данных
  beforeEach(async () => {
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

  // Тест
  it('should create user', async () => {
    // Новые данные пользователя
    const newUser = {
      username: 'test',
      email: 'test@test.ru',
      password: 'test123',
    };
    // Отправляет POST запрос на регистрацию
    const response = await request(app.getHttpServer())
      .post('/users/signup')
      .send(newUser);
    //  Проверяет хеш пароля с помощью argon2
    const passwordIsValid = await argon2.verify(
      response.body.password,
      newUser.password,
    );

    // Проверки работы кода, что он соответствует ожиданиям (assertions)
    // проверяет, что в ответе API поле username содержит то же значение, которое было отправлено в запросе
    // Позволяет убедиться, что сервер не искажает данные и сохраняет их правильно.
    expect(response.body.username).toBe(newUser.username);
    // Позволяет результат проверки хеша пароля
    expect(passwordIsValid).toBe(true);
    // Аналогично проверке username
    expect(response.body.email).toBe(newUser.email);
  });
});
