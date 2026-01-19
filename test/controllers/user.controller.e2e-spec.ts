import type { INestApplication } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma.service';
import request from 'supertest';
import argon2 from 'argon2';

// E2E test

const getMockedUser = () => ({
  username: `user_controller_${Date.now()}_${Math.random()}`,
  email: `user_controller_${Date.now()}_${Math.random()}@test.ru`,
  password: 'mock_123',
});

// Определяет тестовый набор для user.controller
describe('Users controller', () => {
  // Экземпляр приложения
  let app: INestApplication;
  // Сервис пользователей
  let userService: UserService;
  //Сервис для работы с БД
  let prisma: PrismaService;
  let testModule: TestingModule;

  // Перед КАЖДЫМ тестом создает "чистое" тестовое окружение
  beforeEach(async () => {
    // Создаем тестовый модуль с зависимостями
    testModule = await Test.createTestingModule({
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
    await prisma.user.deleteMany({
      where: {
        username: {
          contains: 'user_controller_',
        },
      },
    });
  });

  // После КАЖДОГО теста очищает базу данных, чтобы тесты не влияли друг на друга (изоляция тестов).
  afterEach(async () => {
    // Очищает таблицу пользователей
    await prisma.user.deleteMany({
      where: {
        username: {
          contains: 'user_controller_',
        },
      },
    });
  });

  // После ВСЕХ тестов выполняет cleanup
  afterAll(async () => {
    // Закрывает приложение
    await app.close();
    // Разрывает соединение с БД
    await prisma.$disconnect();

    await testModule.close();
  });

  // Тест
  it('should create user', async () => {
    // Arrange
    // Данные для регистрации нового пользователя
    const newUser = getMockedUser();

    // Act - создаем через API
    // Отправляет POST запрос на регистрацию
    const response = await request(app.getHttpServer())
      .post('/users/signup')
      .send(newUser);

    //  Проверяет хеш пароля с помощью argon2
    const passwordIsValid = await argon2.verify(
      response.body.password,
      newUser.password,
    );

    // Assert
    expect(response.status).toBe(201); // или 200, в зависимости от вашего API

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
