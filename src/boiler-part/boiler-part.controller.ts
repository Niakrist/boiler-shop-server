import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BoilerPartService } from './boiler-part.service';
import { GetAllBoilerPartGto } from './dto/get-all-boiler-part.dto';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';

@Controller('boiler-parts')
export class BoilerPartController {
  constructor(private readonly boilerPartService: BoilerPartService) {}

  @UseGuards(AuthenticatedGuard)
  @UsePipes(new ValidationPipe())
  @Get()
  async findAll(@Query() query: GetAllBoilerPartGto) {
    return this.boilerPartService.findAll(query);
  }

  @UseGuards(AuthenticatedGuard)
  @UsePipes(new ValidationPipe())
  @Get('by-id/:id')
  async getById(@Param('id') id: string) {
    return this.boilerPartService.getById(id);
  }

  @UseGuards(AuthenticatedGuard)
  @UsePipes(new ValidationPipe())
  @Get('bestsellers')
  async getBestseller() {
    return this.boilerPartService.findBestseller();
  }
}
