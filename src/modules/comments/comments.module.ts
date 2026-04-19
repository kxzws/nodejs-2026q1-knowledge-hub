import { Module } from '@nestjs/common';

import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

import { PrismaModule } from '../../prisma/prisma.module';
import { ArticlesModule } from '../articles/articles.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [PrismaModule, ArticlesModule, UsersModule],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
