import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { Role } from 'generated/prisma/enums';

import { ResponseUser } from 'src/common/types/auth.types';

import { GetArticlesQueryDto } from './dto/get-articles-query.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

import { PrismaService } from '../../prisma/prisma.service';
import { CategoriesService } from '../categories/categories.service';
import { UsersService } from '../users/users.service';

import { SortOrder } from 'src/types';

@Injectable()
export class ArticlesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categorisService: CategoriesService,
    private readonly usersService: UsersService,
  ) {}

  async getAll(query: GetArticlesQueryDto) {
    const { status, categoryId, tag } = query;

    const order = query.order ?? SortOrder.DESC;
    const sortBy = query.sortBy ?? 'createdAt';

    return await this.prisma.article.findMany({
      where: {
        status,
        categoryId,
        tags: tag
          ? {
              some: { name: tag },
            }
          : undefined,
      },
      orderBy: {
        [sortBy]: order,
      },
      include: {
        tags: true,
      },
    });
  }

  async getById(id: string, include: boolean = true) {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: {
        author: include,
        category: include,
        comments: include,
        tags: include,
      },
    });

    if (!article)
      throw new NotFoundException(`Article with ID ${id} not found`);

    return article;
  }

  async exists(id: string) {
    if (!id) return false;

    const article = await this.prisma.article.findUnique({ where: { id } });

    return !!article;
  }

  async create(dto: CreateArticleDto) {
    const { authorId, categoryId, tags } = dto;

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

    return await this.prisma.article.create({
      data: {
        ...dto,
        tags: {
          connectOrCreate: tags?.map((tag) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
      include: { author: true, category: true, comments: true, tags: true },
    });
  }

  async update(id: string, dto: UpdateArticleDto, currentUser: ResponseUser) {
    const article = await this.getById(id, false);

    if (
      currentUser.role !== Role.ADMIN &&
      article.authorId !== currentUser.userId
    ) {
      throw new ForbiddenException('You can only update your own articles');
    }

    const { tags } = dto;

    return await this.prisma.article.update({
      where: { id },
      data: {
        ...dto,
        tags: tags
          ? {
              set: [],
              connectOrCreate: tags.map((tag) => ({
                where: { name: tag },
                create: { name: tag },
              })),
            }
          : undefined,
      },
      include: { author: true, category: true, comments: true, tags: true },
    });
  }

  async delete(id: string, currentUser: ResponseUser) {
    const article = await this.getById(id, false);

    if (
      currentUser.role !== Role.ADMIN &&
      article.authorId !== currentUser.userId
    ) {
      throw new ForbiddenException('You can only delete your own articles');
    }

    await this.prisma.article.delete({ where: { id } });

    return;
  }
}
