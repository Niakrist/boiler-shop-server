import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import argon2 from 'argon2';
import { PrismaService } from 'src/prisma.service';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';

// Делаем данные уникальными для каждого запуска
const getMockedUser = () => ({
  username: `user_service_${Date.now()}_${Math.random()}`,
  email: `user_service_${Date.now()}_${Math.random()}@test.ru`,
  password: 'mock_123',
});

// unit-тест сервиса
// Определяет тестовый набор для user.service
describe('Users Service', () => {
  let userService: UserService;
  let prisma: PrismaService;
  let testModule: TestingModule;
  let currentMockedUser: ReturnType<typeof getMockedUser>;

  beforeAll(async () => {
    // Создаем тестовый модуль с зависимостями
    testModule = await Test.createTestingModule({
      imports: [UserModule, ConfigModule.forRoot()],
    }).compile();

    // Получаем инстансы сервисов из DI-контейнера
    userService = testModule.get<UserService>(UserService);
    prisma = testModule.get<PrismaService>(PrismaService);

    // Инициализация модуля (без создания приложения)
    await testModule.init();
  });

  beforeEach(async () => {
    // Создаем новые уникальные данные для каждого теста
    currentMockedUser = getMockedUser();
  });

  // После КАЖДОГО теста
  afterEach(async () => {
    // Очищаем таблицу пользователей после КАЖДОГО теста
    try {
      await prisma.user.delete({
        where: { username: currentMockedUser.username },
      });
    } catch (error) {
      // Игнорируем ошибку если пользователь не найден
    }
  });

  // После ВСЕХ тестов
  afterAll(async () => {
    // Можно также очистить всех тестовых пользователей
    await prisma.user.deleteMany({
      where: {
        username: {
          contains: 'user_service_',
        },
      },
    });
    // Разрывает соединение с БД
    await prisma.$disconnect();
    await testModule.close();
  });

  it('should create user', async () => {
    const createdUser = await userService.create(currentMockedUser);

    expect(createdUser.username).toBe(currentMockedUser.username);
    expect(createdUser.email).toBe(currentMockedUser.email);
    expect(createdUser.password).not.toBe(currentMockedUser.password); // Пароль хэширован

    // Проверяем что пароль корректно хэширован
    const passwordIsValid = await argon2.verify(
      createdUser.password,
      currentMockedUser.password,
    );
    // Проверяем результа
    expect(passwordIsValid).toBe(true);

    // Проверяем результаты
    expect(createdUser.username).toBe(currentMockedUser.username);
    expect(currentMockedUser.email).toBe(currentMockedUser.email);
  });
});
