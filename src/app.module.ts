import { Module } from '@nestjs/common';

import { ArticlesModule } from './modules/articles/articles.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CommentsModule } from './modules/comments/comments.module';
import { UsersModule } from './modules/users/users.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [UsersModule, ArticlesModule, CategoriesModule, CommentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
