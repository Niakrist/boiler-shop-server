import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PaginationService } from 'src/pagination/pagination.service';
import { GetAllBoilerPartGto } from './dto/get-all-boiler-part.dto';

@Injectable()
export class BoilerPartService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}
  async findAll(dto: GetAllBoilerPartGto = {}) {
    console.log('dto ', dto);

    const { skip, perPage } = this.paginationService.getPagination(dto);

    const boilerParts = await this.prisma.boilerPart.findMany({
      skip,
      take: perPage,
    });

    const length = await this.prisma.boilerPart.count();

    return { count: length, rows: boilerParts };
  }

  async findBestseller() {
    return await this.prisma.boilerPart.findMany({
      where: { bestseller: true },
    });
  }

  async findNew() {
    return await this.prisma.boilerPart.findMany({
      where: { newBoilerPart: true },
    });
  }
  async getById(id: string) {
    return this.prisma.boilerPart.findUnique({ where: { id } });
  }

  async getByName(name: string) {
    return this.prisma.boilerPart.findMany({ where: { name } });
  }
  async getSearchTerm(searchTerm?: string) {
    if (searchTerm) {
      return this.getSearchTermFilter(searchTerm);
    }
  }

  private async getSearchTermFilter(searchTerm: string) {
    return this.prisma.boilerPart.findMany({
      where: {
        OR: [
          {
            name: {
              contains: searchTerm,
              mode: 'insensitive', // нечувствительный к регистру
            },
            description: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
  }
}
