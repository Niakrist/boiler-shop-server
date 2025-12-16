import { Injectable } from '@nestjs/common';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class PaginationService {
  getPagination(dto: PaginationDto, defaultPerPage = 4) {
    const page = dto.page ? Math.max(1, +dto.page) : 1; // страница не меньше 1
    const perPage = dto.perPage ? Math.max(1, +dto.perPage) : defaultPerPage; // не меньше 1 элемент

    const skip = (page - 1) * perPage;
    const take = perPage;

    // skip - сколько записей пропустить
    // Страница 1: skip = 0    (не пропускаем ничего)
    // Страница 2: skip = 10   (пропускаем первые 10 записей)

    // take = perPage = limit - сколько записей взять (Ограничивает количество записей на странице)
    // perPage = 10 → take = 10 (берем 10 записей)
    // perPage = 20 → take = 20 (берем 20 записей)

    // page - номер текущей страницы
    // Пользователь запросил ?page=3 → page = 3
    // Пользователь не указал страницу → page = 1

    // perPage - количество элементов на странице
    // ?perPage=10 → perPage = 10 (10 элементов на странице)
    // ?perPage=50 → perPage = 50 (50 элементов на странице)
    // Не указано → perPage = defaultPerPage (по умолчанию 4)

    // Зачем возвращать все 4 переменные?
    // Для БД (Prisma): skip, take
    // Для фронтенда: page, perPage (чтобы отображать "Страница 3 из 10")
    // Для расчета метаданных:

    return { skip, take, page, perPage };
  }
}
