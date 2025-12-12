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
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import {
  CartAddRequest,
  CartAddResponse,
  CartClearRequest,
  CartClearResponse,
  CartDeleteRequest,
  CartDeleteResponse,
  CartRequest,
  CartResponse,
  CartUpdateRequest,
  CartUpdateResponse,
} from './types';

@Controller('cart')
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}
  @ApiBody({ type: CartRequest })
  @ApiOkResponse({ type: CartResponse })
  @Get()
  async getCart(@Request() req) {
    return this.shoppingCartService.getCart(req.user.id);
  }
  @ApiBody({ type: CartAddRequest })
  @ApiOkResponse({ type: CartAddResponse })
  @Post('add')
  async addToCart(@Request() req, @Body() dto: addToCartDto) {
    return this.shoppingCartService.addToCart(
      req.user.userId,
      dto.partId,
      dto.quantity,
    );
  }

  @ApiBody({ type: CartUpdateRequest })
  @ApiOkResponse({ type: CartUpdateResponse })
  @Put('item/:partId')
  async updateItem(
    @Request() req,
    @Param('partId') partId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.shoppingCartService.updateQuantity(
      req.user.id,
      partId,
      dto.quantity,
    );
  }

  @ApiBody({ type: CartDeleteRequest })
  @ApiOkResponse({ type: CartDeleteResponse })
  @Delete('item/:partId')
  async removeItem(@Request() req, @Param('partId') partId: string) {
    return this.shoppingCartService.removeFromCart(req.user.id, partId);
  }

  @ApiBody({ type: CartClearRequest })
  @ApiOkResponse({ type: CartClearResponse })
  @Delete('clear')
  async clearCart(@Request() req) {
    return this.shoppingCartService.clearCart(req.user.id);
  }
}
