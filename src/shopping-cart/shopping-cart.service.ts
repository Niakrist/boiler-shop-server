import { Injectable, NotFoundException } from '@nestjs/common';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { PrismaService } from 'src/prisma.service';
import {
  CartAddRequest,
  CartAddResponse,
  CartDeleteRequest,
  CartDeleteResponse,
  CartRequest,
  CartResponse,
  CartUpdateRequest,
  CartUpdateResponse,
} from './types';

@Injectable()
export class ShoppingCartService {
  constructor(private readonly prisma: PrismaService) {}
  async createCart(userId: string) {
    // Создать корзину для пользователя
    return this.prisma.shoppingCart.create({
      data: { userId: userId },
      include: { items: { include: { part: true } } },
    });
  }

  // Получить корзину пользователя

  async getCart(userId: string) {
    let cart = await this.prisma.shoppingCart.findFirst({
      where: { userId },
      include: { items: { include: { part: true } } },
    });
    if (!cart) {
      cart = await this.createCart(userId);
    }

    return {
      ...cart,
      totalPrice: this.calculateTotalPrice(cart.items),
      totalItems: this.calculateTotalItems(cart.items),
    };
  }

  // Добавить товар в корзину
  async addToCart(userId: string, partId: string, quantity: number = 1) {
    let cart = await this.prisma.shoppingCart.findFirst({ where: { userId } });

    if (!cart) {
      cart = await this.createCart(userId);
    }

    // Проверяем наличие товара
    const part = await this.prisma.boilerPart.findFirst({
      where: { id: partId },
    });
    if (!part) {
      throw new NotFoundException('Товар не найден');
    }
    if (part.inStock < quantity) {
      throw new Error('Недостаточно товара в наличии');
    }
    // Ищем товар в корзине
    const isExistingItem = await this.prisma.shoppingCartItem.findUnique({
      where: { cartId_partId: { cartId: cart.id, partId: part.id } },
    });

    if (isExistingItem) {
      // Обновляем количество
      return this.prisma.shoppingCartItem.update({
        where: { id: isExistingItem.id },
        data: { quantity: isExistingItem.quantity + quantity },
        include: { part: true },
      });
    } else {
      return this.prisma.shoppingCartItem.create({
        data: {
          cartId: cart.id,
          partId,
          quantity,
          priceAtAddition: part.price, // Сохраняем цену на момент добавления
        },
        include: { part: true },
      });
    }
  }

  // Обновить количество товара

  async updateQuantity(userId: string, partId: string, quantity: number) {
    const cart = await this.prisma.shoppingCart.findFirst({
      where: { userId },
    });

    if (!cart) {
      throw new NotFoundException('Корзина не найдена');
    }
    if (quantity <= 0) {
      // Удаляем товар из корзины
      return this.removeFromCart(userId, partId);
    }
    // Проверяем наличие товара
    const part = await this.prisma.boilerPart.findFirst({
      where: { id: partId },
    });

    if (part && part.inStock < quantity) {
      throw new Error('Недостаточно товара в наличии');
    }

    return this.prisma.shoppingCartItem.update({
      where: {
        cartId_partId: {
          cartId: cart.id,
          partId: partId,
        },
      },
      data: { quantity },
      include: { part: true },
    });
  }

  // Удалить товар из корзины
  async removeFromCart(userId: string, partId: string) {
    const cart = await this.prisma.shoppingCart.findFirst({
      where: { userId },
    });
    if (!cart) {
      throw new NotFoundException('Корзина не найдена');
    }
    return this.prisma.shoppingCartItem.delete({
      where: { cartId_partId: { cartId: cart.id, partId } },
    });
  }

  // Очистить корзину
  async clearCart(userId: string) {
    const cart = await this.prisma.shoppingCart.findFirst({
      where: { userId },
    });

    if (!cart) {
      throw new NotFoundException('Корзина не найдена');
    }

    return this.prisma.shoppingCartItem.deleteMany({
      where: { cartId: cart.id },
    });
  }

  // Вспомогательные методы для вычислений
  private calculateTotalPrice(items: any[]) {
    return items.reduce((total, item) => {
      // Используем текущую цену товара или цену на момент добавления
      const price = item.part?.price || item.priceAtAddition || 0;
      return total + price * item.quantity;
    }, 0);
  }
  private calculateTotalItems(items: any[]) {
    return items.reduce((total, item) => total + item.quantity, 0);
  }
  s;
}
