import { Injectable } from '@nestjs/common';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class PaginationService {
  getPagination(dto: PaginationDto, defaultPage = 4) {
    const page = dto.page ? +dto.page : 1;

    console.log('page: ', page);

    const perPage = dto.perPage ? +dto.perPage : defaultPage;
    const skip = (page - 1) * perPage;
    return { skip, perPage };
  }
}
