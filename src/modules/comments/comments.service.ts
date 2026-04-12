import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { GetCommentsQueryDto } from './dto/get-comments-query.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

import { PrismaService } from '../../prisma/prisma.service';
import { ArticlesService } from '../articles/articles.service';
import { UsersService } from '../users/users.service';

import { SortOrder } from 'src/types';

@Injectable()
export class CommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly articlesService: ArticlesService,
    private readonly usersService: UsersService,
  ) {}

  async getAll() {
    return await this.prisma.comment.findMany({
      // include: { author: true, article: true },
    });
  }

  async getAllByArticleId(query: GetCommentsQueryDto) {
    const { articleId } = query;

    const order = query.order ?? SortOrder.DESC;
    const sortBy = query.sortBy ?? 'createdAt';

    const articleExists = await this.articlesService.exists(articleId);

    if (!articleExists) {
      throw new UnprocessableEntityException(
        `Article with ID ${articleId} does not exist`,
      );
    }

    return await this.prisma.comment.findMany({
      where: {
        articleId,
      },
      orderBy: {
        [sortBy]: order,
      },
      // include: { author: true, article: true },
    });
  }

  async getById(id: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: { author: true, article: true },
    });

    if (!comment)
      throw new NotFoundException(`Comment with ID ${id} not found`);

    return comment;
  }

  async create(dto: CreateCommentDto) {
    const { articleId, authorId } = dto;

    const articleExists = this.articlesService.exists(articleId);
    const userExists = this.usersService.exists(authorId);

    if (!articleExists) {
      throw new UnprocessableEntityException(
        `Article with ID ${articleId} does not exist`,
      );
    }

    if (!!authorId && !userExists) {
      throw new UnprocessableEntityException(
        `User with ID ${authorId} does not exist`,
      );
    }

    return await this.prisma.comment.create({
      data: dto,
      // include: { author: true, article: true },
    });
  }

  async delete(id: string) {
    await this.getById(id);

    await this.prisma.comment.delete({ where: { id } });

    return;
  }
}
