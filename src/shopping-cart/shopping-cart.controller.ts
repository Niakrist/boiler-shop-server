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

@Controller('cart')
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}
  @Get()
  async getCart(@Request() req) {
    return this.shoppingCartService.getCart(req.user.id);
  }

  @Post('add')
  async addToCart(@Request() req, @Body() dto: addToCartDto) {
    return this.shoppingCartService.addToCart(
      req.user.userId,
      dto.partId,
      dto.quantity,
    );
  }
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
  @Delete('item/:partId')
  async removeItem(@Request() req, @Param('partId') partId: string) {
    return this.shoppingCartService.removeFromCart(req.user.id, partId);
  }

  @Delete('clear')
  async clearCart(@Request() req) {
    return this.shoppingCartService.clearCart(req.user.id);
  }
}
