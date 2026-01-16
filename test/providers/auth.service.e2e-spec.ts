import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma.service';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';

// Интеграционный тест (или unit-тест с зависимостями) для AuthService
// Проверить, что метод authService.validateUser() корректно:
//  - Находит пользователя по username
//  - Проверяет пароль (сравнивает с хэшем)
//  - Возвращает данные пользователя без пароля

// Делаем данные уникальными для каждого запуска
const getMockedUser = () => ({
  username: `auth_service_${Date.now()}_${Math.random()}`,
  email: `auth_service_${Date.now()}_${Math.random()}@test.ru`,
  password: 'mock_123',
});

describe('Auth Service', () => {
  let userService: UserService;
  let prisma: PrismaService;
  let authService: AuthService;
  let testModule: TestingModule;
  let mockedUser: ReturnType<typeof getMockedUser>;

  beforeAll(async () => {
    // 1. Создаем модуль с зависимостями и подключаемся к БД (ОДИН РАЗ для всех тестов)
    testModule = await Test.createTestingModule({
      imports: [UserModule, AuthModule, ConfigModule.forRoot()],
    }).compile();

    // 2. Получаем инстансы сервисов из DI
    userService = testModule.get<UserService>(UserService);
    prisma = testModule.get<PrismaService>(PrismaService);
    authService = testModule.get<AuthService>(AuthService);

    // 3. Создаем приложение (хотя для сервиса это может быть избыточно)
    await testModule.init();
  });

  beforeEach(async () => {
    // Перед КАЖДЫМ тестом создаем пользователя
    mockedUser = getMockedUser();
    const user = await userService.create(mockedUser);
    expect(user).toBeDefined(); // Проверяем создание
  });

  afterEach(async () => {
    // После КАЖДОГО теста очищаем только тестовые данные

    try {
      await prisma.user.delete({ where: { username: mockedUser.username } });
    } catch (error) {}
  });

  afterAll(async () => {
    // После ВСЕХ тестов отключаемся от БД
    await prisma.$disconnect();
    // await testModule.close() - это обязательный шаг для:
    // 1. Корректного завершения тестов
    // 2. Освобождения всех ресурсов
    // 3. Вызова хуков жизненного цикла
    // 4. Предотвращения утечек памяти
    // 5. Решения проблемы с Jest did not exit
    // Без него: Тесты могут работать, но Jest будет "висеть",
    // что особенно проблематично в CI/CD пайплайнах или при множественных запусках тестов.
    await testModule.close();
  });

  it('should validate user', async () => {
    // Вызываем метод validateUser с правильными credentials
    const user = await authService.validateUser(
      mockedUser.username,
      mockedUser.password,
    );

    // Проверяем, что вернулись корректные данные
    expect(user?.username).toBe(mockedUser.username);
    expect(user?.email).toBe(mockedUser.email);
  });
});
