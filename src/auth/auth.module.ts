import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { BookmarkModule } from 'src/bookmark/bookmark.module';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [AuthModule, UserModule, BookmarkModule, PrismaModule, ConfigModule.forRoot({
    isGlobal: true
  })],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
