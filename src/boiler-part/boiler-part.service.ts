import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PaginationService } from 'src/pagination/pagination.service';
import { IBoilerPart } from './types';
import { GetAllBoilerPartDto } from './dto/get-all-boiler-part.dto';

// @Injectable() Это декоратор NestJS
// Позволяет внедрять этот сервис в другие классы через Dependency Injection
// Без него сервис не будет работать в DI-контейнере NestJS
@Injectable()
export class BoilerPartService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}
  async findAll(
    dto: GetAllBoilerPartDto = {},
  ): Promise<{ count: number; data: IBoilerPart[] }> {
    const { skip, take } = this.paginationService.getPagination(dto);

    const [data, count] = await Promise.all([
      this.prisma.boilerPart.findMany({
        skip,
        take,
      }),
      this.prisma.boilerPart.count(),
    ]);

    return { count, data };
  }

  async findBestseller(
    dto: GetAllBoilerPartDto = {},
  ): Promise<{ count: number; data: IBoilerPart[] }> {
    const { skip, take } = this.paginationService.getPagination(dto);
    const [data, count] = await Promise.all([
      this.prisma.boilerPart.findMany({
        where: { bestseller: true },
        skip,
        take,
      }),
      this.prisma.boilerPart.count({
        where: { bestseller: true },
      }),
    ]);

    return { count, data };
  }

  async findNew(
    dto: GetAllBoilerPartDto = {},
  ): Promise<{ count: number; data: IBoilerPart[] }> {
    const { skip, take } = this.paginationService.getPagination(dto);
    const [data, count] = await Promise.all([
      this.prisma.boilerPart.findMany({
        where: { newBoilerPart: true },
        skip,
        take,
      }),
      this.prisma.boilerPart.count({
        where: { newBoilerPart: true },
      }),
    ]);

    return { count, data };
  }
  async getById(id: string): Promise<IBoilerPart | null> {
    return this.prisma.boilerPart.findUnique({ where: { id } });
  }

  async getByName(name: string): Promise<IBoilerPart | null> {
    return await this.prisma.boilerPart.findFirst({
      where: { name },
    });
  }

  async getSearchTerm(dto: GetAllBoilerPartDto = {}) {
    if (dto.searchTerm) {
      const { skip, take } = this.paginationService.getPagination(dto);
      const [data, count] = await Promise.all([
        this.prisma.boilerPart.findMany({
          where: {
            OR: [
              {
                name: {
                  contains: dto.searchTerm,
                  mode: 'insensitive', // нечувствительный к регистру
                },
                // description: {
                //   contains: dto.searchTerm,
                //   mode: 'insensitive',
                // },
              },
            ],
          },
          skip,
          take,
        }),
        this.prisma.boilerPart.count({
          where: {
            OR: [
              {
                name: {
                  contains: dto.searchTerm,
                  mode: 'insensitive', // нечувствительный к регистру
                },
                // description: {
                //   contains: dto.searchTerm,
                //   mode: 'insensitive',
                // },
              },
            ],
          },
        }),
      ]);
      return { count, data };
    }
  }
}
