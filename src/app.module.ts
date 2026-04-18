import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';

import { AuthGuard } from './common/guards/auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

import { PrismaModule } from './prisma/prisma.module';
import { ArticlesModule } from './modules/articles/articles.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CommentsModule } from './modules/comments/comments.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        name: 'auth',
        ttl: 60000,
        limit: 10,
      },
    ]),
    EventEmitterModule.forRoot(),
    JwtModule,
    PrismaModule,
    UsersModule,
    ArticlesModule,
    CategoriesModule,
    CommentsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AppService,
  ],
})
export class AppModule {}
