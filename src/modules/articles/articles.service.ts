import { randomUUID } from 'node:crypto';
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { Article, Status } from './entities/article.entity';

import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

import { CategoriesService } from '../categories/categories.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class ArticlesService {
  private articles = new Map<string, Article>();

  constructor(
    private readonly categorisService: CategoriesService,
    private readonly usersService: UsersService,
  ) {}

  // TODO: Supports optional query parameters for filtering: status, categoryId, tag (e.g. GET /article?status=published&tag=nodejs)
  getAll() {
    return Array.from(this.articles.values());
  }

  getById(id: string) {
    const article = this.articles.get(id);

    if (!article)
      throw new NotFoundException(`Article with ID ${id} not found`);

    return article;
  }

  exists(id: string) {
    return this.articles.has(id);
  }

  create(dto: CreateArticleDto) {
    const { title, content, status, authorId, categoryId, tags } = dto;

    const categoryExists = this.categorisService.exists(categoryId);
    const userExists = this.usersService.exists(authorId);

    if (!!categoryId && !categoryExists) {
      throw new UnprocessableEntityException(
        `Category with ID ${categoryId} does not exist`,
      );
    }

    if (!!authorId && !userExists) {
      throw new UnprocessableEntityException(
        `User with ID ${authorId} does not exist`,
      );
    }

    const timestamp = Date.now();

    const newArticle = {
      id: randomUUID(),
      title,
      content,
      status: status ?? Status.DRAFT,
      authorId: authorId ?? null,
      categoryId: categoryId ?? null,
      tags: tags ?? [],
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.articles.set(newArticle.id, newArticle);

    return newArticle;
  }

  update(id: string, dto: UpdateArticleDto) {
    const article = this.getById(id);

    const timestamp = Date.now();

    this.articles.set(article.id, {
      ...article,
      ...dto,
      updatedAt: timestamp,
    });

    return this.articles.get(article.id);
  }

  delete(id: string) {
    this.getById(id);

    this.articles.delete(id);

    return;
  }
}
