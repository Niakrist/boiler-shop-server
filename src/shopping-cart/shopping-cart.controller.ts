import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import { addToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  CartAddResponse,
  CartClearResponse,
  CartDeleteResponse,
  CartResponse,
  CartUpdateResponse,
} from './types';
import type { AuthenticatedRequest } from 'src/common/types/request.type';

@ApiTags('Корзина покупок')
@Controller('cart')
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}

  @ApiOperation({
    summary: 'Получить корзину пользователя',
    description: 'Возвращает все товары в корзине текущего пользователя',
  })
  @ApiOkResponse({ type: CartResponse })
  @Get()
  async getCart(@Request() req: AuthenticatedRequest) {
    return this.shoppingCartService.getCart(req.user.id);
  }

  @ApiOperation({
    summary: 'Добавить товар в корзину',
    description: 'Добавляет указанный товар в корзину пользователя',
  })
  @ApiBody({ type: addToCartDto })
  @ApiOkResponse({ type: CartAddResponse })
  @Post('add')
  async addToCart(
    @Request() req: AuthenticatedRequest,
    @Body() dto: addToCartDto,
  ) {
    return this.shoppingCartService.addToCart(
      req.user.id,
      dto.partId,
      dto.quantity,
    );
  }

  @ApiOperation({
    summary: 'Обновить количество товара в корзине',
    description: 'Изменяет количество указанного товара в корзине пользователя',
  })
  @ApiBody({ type: UpdateCartItemDto })
  @ApiOkResponse({ type: CartUpdateResponse })
  @Put('item/:partId')
  async updateItem(
    @Request() req: AuthenticatedRequest,
    @Param('partId') partId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.shoppingCartService.updateQuantity(
      req.user.id,
      partId,
      dto.quantity,
    );
  }

  @ApiOperation({
    summary: 'Удалить товар из корзины',
    description: 'Удаляет указанный товар из корзины пользователя',
  })
  @ApiOkResponse({ type: CartDeleteResponse })
  @ApiParam({
    name: 'partId',
    required: true,
    description: 'ID детали (товара)',
    example: 'cmizx1v870000ykv4emwf7csx',
  })
  @Delete('item/:partId')
  async removeItem(
    @Request() req: AuthenticatedRequest,
    @Param('partId') partId: string,
  ) {
    return this.shoppingCartService.removeFromCart(req.user.id, partId);
  }

  @ApiOperation({
    summary: 'Очистить корзину',
    description: 'Удаляет все товары из корзины пользователя',
  })
  @ApiOkResponse({ type: CartClearResponse })
  @Delete('clear')
  async clearCart(@Request() req: AuthenticatedRequest) {
    return this.shoppingCartService.clearCart(req.user.id);
  }
}
