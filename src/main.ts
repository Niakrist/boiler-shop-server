import session from 'express-session';
import passport from 'passport';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: '12345', // Секретный ключ для подписи cookie
      resave: false, // Не пересохранять сессию, если она не изменилась
      saveUninitialized: false, // Не сохранять пустые сессии (GDPR-совместимость: не создавать сессию, пока пользователь не залогинится)
    }),
  );
  // Инициализация Passport
  //  1. Добавляет методы req.login(), req.logout(), req.isAuthenticated() и др.
  //  Подготавливает контекст для аутентификации
  app.use(passport.initialize());
  // Связывает Passport с сессиями
  // 1. Сериализует пользователя в сессию (сохраняет user.id в сессии).
  // 2. Десериализует пользователя из сессии (превращает user.id обратно в объект пользователя)
  app.use(passport.session());

  await app.listen(process.env.PORT ?? 5001);
}
bootstrap();

// Что делает  session({})
// 1. Создает middleware для управления сессиями
// 2. Хранит данные пользователя между HTTP-запросами
// 3. Использует cookie для идентификации сессии
// 4. По умолчанию хранит данные в памяти (в продакшене нужно использовать Redis, MongoDB и т.д.)
