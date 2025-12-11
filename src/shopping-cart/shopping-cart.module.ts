import { Module } from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import { ShoppingCartController } from './shopping-cart.controller';
import { BoilerPartModule } from 'src/boiler-part/boiler-part.module';
import { UserModule } from 'src/user/user.module';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [BoilerPartModule, UserModule],
  controllers: [ShoppingCartController],
  providers: [ShoppingCartService, PrismaService],
})
export class ShoppingCartModule {}
