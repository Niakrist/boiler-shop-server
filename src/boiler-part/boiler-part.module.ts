import { Module } from '@nestjs/common';
import { BoilerPartService } from './boiler-part.service';
import { BoilerPartController } from './boiler-part.controller';
import { PrismaService } from 'src/prisma.service';
import { PaginationService } from 'src/pagination/pagination.service';

@Module({
  controllers: [BoilerPartController],
  providers: [BoilerPartService, PrismaService, PaginationService],
  exports: [BoilerPartService],
})
export class BoilerPartModule {}
