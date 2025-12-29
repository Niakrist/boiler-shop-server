import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma.service';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';

// Интеграционный тест (или unit-тест с зависимостями) для AuthService
// Интеграционный тест (или unit-тест с зависимостями) для AuthService
// Интеграционный тест (или unit-тест с зависимостями) для AuthService
// Проверить, что метод authService.validateUser() корректно:
//  - Находит пользователя по username
//  - Проверяет пароль (сравнивает с хэшем)
//  - Возвращает данные пользователя без пароля

const mockedUser = {
  username: 'mock_service',
  email: 'mock_service@test.ru',
  password: 'mock_123',
};

describe('Auth Service', () => {
  let userService: UserService;
  let prisma: PrismaService;
  let authService: AuthService;

  beforeEach(async () => {
    // 1. Создаем тестовый модуль с зависимостями
    const testModule: TestingModule = await Test.createTestingModule({
      imports: [UserModule, AuthModule, ConfigModule.forRoot()],
    }).compile();

    // 2. Получаем инстансы сервисов из DI
    userService = testModule.get<UserService>(UserService);
    prisma = testModule.get<PrismaService>(PrismaService);
    authService = testModule.get<AuthService>(AuthService);

    // 3. Создаем приложение (хотя для сервиса это может быть избыточно)
    await testModule.init();

    // 4. Очищаем БД и создаем тестового пользователя
    await prisma.user.deleteMany();
    const user = await userService.create(mockedUser);
    expect(user).toBeDefined(); // Проверяем создание
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should validate user', async () => {
    // Вызываем метод validateUser с правильными credentials
    const user = await authService.validateUser(
      mockedUser.username, // 'mock_service'
      mockedUser.password, // 'mock_123'
    );

    // Проверяем, что вернулись корректные данные
    expect(user?.username).toBe(mockedUser.username); // 'mock_service'
    expect(user?.email).toBe(mockedUser.email); // 'mock_service@test.ru'
  });
});
