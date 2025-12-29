import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import argon2 from 'argon2';
import { PrismaService } from 'src/prisma.service';
import { IUser } from 'src/user/types';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';

// unit-тест сервиса
// Определяет тестовый набор для user.service
describe('Users Service', () => {
  let userService: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    // Создаем тестовый модуль с зависимостями
    const testModule: TestingModule = await Test.createTestingModule({
      imports: [UserModule, ConfigModule.forRoot()],
    }).compile();

    // Получаем инстансы сервисов из DI-контейнера
    userService = testModule.get<UserService>(UserService);
    prisma = testModule.get<PrismaService>(PrismaService);

    // Инициализация модуля (без создания приложения)
    await testModule.init();
  });

  // После КАЖДОГО теста
  afterEach(async () => {
    // Очищаем таблицу пользователей после КАЖДОГО теста
    await prisma.user.deleteMany();
  });

  // После ВСЕХ тестов
  afterAll(async () => {
    // Разрывает соединение с БД
    await prisma.$disconnect();
  });

  it('should create user', async () => {
    const newUser = {
      username: 'test',
      email: 'test@test.ru',
      password: 'test123',
    };

    // ВЫЗЫВАЕМ НЕПОСРЕДСТВЕННО МЕТОД СЕРВИСА (без HTTP!)
    const user = (await userService.create(newUser)) as IUser;

    // Проверяем хеш пароля
    const passwordIsValid = await argon2.verify(
      user.password,
      newUser.password,
    );

    // Проверяем результаты
    expect(user.username).toBe(newUser.username);
    expect(passwordIsValid).toBe(true);
    expect(user.email).toBe(newUser.email);
  });
});
