import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Кастомный Guard для локальной аутентификации (email/пароль) с автоматическим созданием сессии.

@Injectable()
// Наследуется от AuthGuard('local') - встроенного Guard для стратегии 'local'
// 'local' - это имя стратегии Passport (обычно для логина по email/пароль)
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    // super.canActivate(context) - вызывает стандартную проверку Passport:
    // Запускает стратегию 'local'
    // Проверяет email/пароль
    // Если валидно - добавляет пользователя в req.user
    // Возвращает true/false
    const result = (await super.canActivate(context)) as boolean;

    // Создание сессии
    const request = context.switchToHttp().getRequest();
    // super.logIn(request) - метод Passport для создания сессии:
    // Сериализует пользователя (req.user) в сессию
    // Сохраняет сессию в хранилище (Redis, базу данных и т.д.)
    // Устанавливает session cookie в ответ
    await super.logIn(request);

    return result;
  }
}
