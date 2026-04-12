import { randomUUID } from 'node:crypto';
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { Article, Status } from './entities/article.entity';

import { GetArticlesQueryDto } from './dto/get-articles-query.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

import { PrismaService } from '../../prisma/prisma.service';
import { CategoriesService } from '../categories/categories.service';
import { UsersService } from '../users/users.service';

import { SortOrder } from 'src/types';
import { getSortCb } from 'src/utils/sort';

@Injectable()
export class ArticlesService {
  private articles = new Map<string, Article>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly categorisService: CategoriesService,
    private readonly usersService: UsersService,
  ) {}

  getAll(query: GetArticlesQueryDto) {
    const { status, categoryId, tag } = query;

    const order = query.order ?? SortOrder.DESC;
    const sortBy = query.sortBy ?? 'createdAt';

    const filteredArticles = Array.from(this.articles.values()).filter(
      (article) =>
        (!status || article.status === status) &&
        (!categoryId || article.categoryId === categoryId) &&
        (!tag || article.tags.includes(tag)),
    );

    const sortedArticles = [...filteredArticles].sort(
      getSortCb<Article>({ order, sortBy }),
    );

    return sortedArticles;
  }

  getById(id: string) {
    const article = this.articles.get(id);

    if (!article)
      throw new NotFoundException(`Article with ID ${id} not found`);

    return article;
  }

  async exists(id: string) {
    const article = this.prisma.article.findUnique({ where: { id } });

    return !!article;
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
