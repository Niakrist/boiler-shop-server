import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BoilerPartService } from './boiler-part.service';
import { GetAllBoilerPartDto } from './dto/get-all-boiler-part.dto';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import {
  FindByIdRequest,
  FindByIdResponse,
  FindByNameRequest,
  FindByNameResponse,
  GetBestsellersResponse,
  GetNewsResponse,
  PaginatedAndFilterResponse,
  SearchRequet,
  SearchResponse,
} from './types';

@Controller('boiler-parts')
export class BoilerPartController {
  constructor(private readonly boilerPartService: BoilerPartService) {}

  @ApiOkResponse({ type: PaginatedAndFilterResponse })
  @UseGuards(AuthenticatedGuard)
  @Get()
  async findAll(@Query() query: GetAllBoilerPartDto) {
    return this.boilerPartService.findAll(query);
  }

  @ApiBody({ type: FindByIdRequest })
  @ApiOkResponse({ type: FindByIdResponse })
  @UseGuards(AuthenticatedGuard)
  @Get('by-id/:id')
  async findById(@Param('id') id: string) {
    return this.boilerPartService.getById(id);
  }

  @ApiOkResponse({ type: GetBestsellersResponse })
  @UseGuards(AuthenticatedGuard)
  @Get('bestsellers')
  async findBestseller() {
    return this.boilerPartService.findBestseller();
  }

  @ApiOkResponse({ type: GetNewsResponse })
  @UseGuards(AuthenticatedGuard)
  @Get('new')
  async findNew() {
    return this.boilerPartService.findNew();
  }
  @ApiBody({ type: FindByNameRequest })
  @ApiOkResponse({ type: FindByNameResponse })
  @UseGuards(AuthenticatedGuard)
  @Post('name')
  async findByName(@Body() { name }: { name: string }) {
    return this.boilerPartService.getByName(name);
  }

  @ApiBody({ type: SearchRequet })
  @ApiOkResponse({ type: SearchResponse })
  @UseGuards(AuthenticatedGuard)
  @Get('search')
  async findBySearchTern(@Query() query: GetAllBoilerPartDto) {
    return this.boilerPartService.getSearchTerm(query);
  }
}
