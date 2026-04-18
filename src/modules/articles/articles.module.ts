import { Module } from '@nestjs/common';

import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';

import { CategoriesModule } from '../categories/categories.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [CategoriesModule, UsersModule],
  controllers: [ArticlesController],
  providers: [ArticlesService],
  exports: [ArticlesService],
})
export class ArticlesModule {}
