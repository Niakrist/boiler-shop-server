import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BoilerPartModule } from './boiler-part/boiler-part.module';
import { PaginationModule } from './pagination/pagination.module';
import { ShoppingCartModule } from './shopping-cart/shopping-cart.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot(),
    AuthModule,
    BoilerPartModule,
    PaginationModule,
    ShoppingCartModule,
    PaymentModule,
  ],
})
export class AppModule {}
