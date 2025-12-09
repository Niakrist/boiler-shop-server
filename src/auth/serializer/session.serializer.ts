import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

// Этот код реализует кастомный сериализатор сессий для Passport.js в NestJS.
// Он управляет тем, какие данные пользователя сохраняются в сессии и как они восстанавливаются.

// Сериализация (при логине)
// Объект пользователя {id: 1, email: 'test@mail.com', name: 'John'} - Сохраняется в сессии (обычно только ID или минимум данных)

// Десериализация (при каждом запросе)
// ID из сессии → Запрос в БД → Полный объект пользователя → req.user

@Injectable()
export class SessionSerializer extends PassportSerializer {
  // serializeUser - что сохраняется в сессии
  serializeUser(user: any, done: Function) {
    // Лучше так:
    // done(null, {
    //   id: user.id,
    //   email: user.email,
    //   role: user.role
    // })

    done(null, user); // ← Сохраняем ВЕСЬ объект пользователя (Это может быть опасно и неэффективно)
  }

  // deserializeUser - как восстанавливается пользователь
  deserializeUser(payload: any, done: Function) {
    done(null, payload); // ← Просто возвращаем то, что сохранили (Поскольку мы сохранили весь объект, то и восстанавливаем его целиком.)
  }
}

// Проблемы этого подхода
// 1. Безопасность - ВСЁ это попадет в сессию!
const user = {
  id: 1,
  email: 'test@mail.com',
  passwordHash: '$2b$10$...', // Хэш пароля!
  isAdmin: true,
  creditCard: '**** **** **** 1234',
};

// 2. Производительность
// Сессия хранится на сервере (Redis/БД)
// Большие объекты → больше памяти/трафика
// Cookie может превысить лимит 4KB

// 3. Консистентность
// Если данные пользователя изменились в БД, но сессия старая
// Пользователь сменил email в БД
// Но в сессии остался старый email
// До перелогина будет видеть старые данные
