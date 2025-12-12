import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

// Guard - это декоратор или класс, который определяет, имеет ли запрос доступ к определенному маршруту.
// Это аналог middleware в Express, но более интегрированный в архитектуру NestJS.
// Guard (страж) в NestJS для проверки аутентификации пользователя.
@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    // Проверяем все возможные признаки аутентификации
    const isAuthenticated = request.isAuthenticated();

    if (!isAuthenticated) {
      throw new ForbiddenException('Please log in first');
    }

    // request.isAuthenticated() добавляется Passport.js когда мы используем app.use(passport.initialize()) в main.ts
    // Метод проверяет:
    // 1. Есть ли в req.session информация о пользователе
    // 2. Была ли сессия десериализована Passport
    // 3. Существует ли req.user объект
    return request.isAuthenticated();
  }
}

// canActivate() - главный метод Guard, должен вернуть boolean или Promise<boolean>
// true - доступ разрешен (пользователь аутентифицирован)
// false - доступ запрещен (пользователь не аутентифицирован)

// Что происходит при запросе
// 1. Если пользователь НЕ аутентифицирован:
// - Guard возвращает false
// - NestJS автоматически отправляет 401 Unauthorized
// - Запрос НЕ доходит до контроллера

// Если пользователь аутентифицирован:
// Guard возвращает true
// Запрос проходит к контроллеру
// В req.user доступны данные пользователя
