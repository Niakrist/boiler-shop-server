import { Injectable, NotFoundException } from '@nestjs/common';
import { BoilerPartService } from 'src/boiler-part/boiler-part.service';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { ShoppingCartDto } from './dro/shopping-cart.dto';
import { addToCartDto } from './dro/add-to-cart.dto';

@Injectable()
export class ShoppingCartService {
  constructor(
    private readonly userService: UserService,
    private readonly boilerPaerService: BoilerPartService,
    private readonly prisma: PrismaService,
  ) {}

  async findAll(userId: string): Promise<ShoppingCartDto[] | null> {
    const carts = await this.prisma.shoppingCart.findMany({
      where: { userId },
    });
    return carts;
  }

  async add(dto: addToCartDto) {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    const part = await this.prisma.boilerPart.findUnique({
      where: { id: dto.partId },
    });

    if (!user || !part) {
      throw new NotFoundException('Not found');
    }

    const cart = await this.prisma.shoppingCart.create({
      data: {
        name: part.name,
        price: part.price,
        boilerManufacturer: part.boilerManufacturer,
        partsManufacturer: part.partsManufacturer,
        image: part.images?.[0] || 'default.jpg',
        inStock: part.inStock,
        userId: user.id,
        partId: part.id,
        count: 1,
        totalPrice: part.price,
      },
    });
    return cart;
  }
  async updateCount(count: number, partId: string) {
    const part = await this.prisma.shoppingCart.findFirst({
      where: { partId },
    });
  }
}
