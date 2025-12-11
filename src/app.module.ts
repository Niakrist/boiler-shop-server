import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BoilerPartModule } from './boiler-part/boiler-part.module';
import { PaginationModule } from './pagination/pagination.module';

@Module({
  imports: [UserModule, ConfigModule.forRoot(), AuthModule, BoilerPartModule, PaginationModule],
})
export class AppModule {}
