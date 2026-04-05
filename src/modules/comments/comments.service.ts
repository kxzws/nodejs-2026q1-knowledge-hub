import { randomUUID } from 'node:crypto';
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { Comment } from './entities/comment.entity';

import { GetCommentsQueryDto } from './dto/get-comments-query.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

import { ArticlesService } from '../articles/articles.service';
import { UsersService } from '../users/users.service';

import { SortOrder } from 'src/types';
import { getSortCb } from 'src/utils/sort';

@Injectable()
export class CommentsService {
  private comments = new Map<string, Comment>();

  constructor(
    private readonly articlesService: ArticlesService,
    private readonly usersService: UsersService,
  ) {}

  getAll() {
    return Array.from(this.comments.values());
  }

  getAllByArticleId(query: GetCommentsQueryDto) {
    const { articleId } = query;

    const order = query.order ?? SortOrder.DESC;
    const sortBy = query.sortBy ?? 'createdAt';

    const articleExists = this.articlesService.exists(articleId);

    if (!articleExists) {
      throw new UnprocessableEntityException(
        `Article with ID ${articleId} does not exist`,
      );
    }

    const filteredComments = this.getAll().filter(
      (comment) => comment.articleId === articleId,
    );

    const sortedComments = [...filteredComments].sort(
      getSortCb<Comment>({ order, sortBy }),
    );

    return sortedComments;
  }

  create(dto: CreateCommentDto) {
    const { content, articleId, authorId } = dto;

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

    const timestamp = Date.now();

    const newComment = {
      id: randomUUID(),
      content,
      articleId,
      authorId: authorId ?? null,
      createdAt: timestamp,
    };

    this.comments.set(newComment.id, newComment);

    return newComment;
  }

  delete(id: string) {
    const comment = this.comments.get(id);

    if (!comment)
      throw new NotFoundException(`Comment with ID ${id} not found`);

    this.comments.delete(id);

    return;
  }

  @OnEvent('user.deleted')
  handleAuthorDeleted(payload: { authorId: string }) {
    const { authorId } = payload;

    const commentsWithAuthor = this.getAll().filter(
      (comment) => comment.authorId === authorId,
    );

    if (commentsWithAuthor.length) {
      commentsWithAuthor.forEach(({ id }) => {
        this.delete(id);
      });
    }
  }

  @OnEvent('article.deleted')
  handleArticleDeleted(payload: { articleId: string }) {
    const { articleId } = payload;

    const articleComments = this.getAllByArticleId({ articleId });

    if (articleComments.length) {
      articleComments.forEach(({ id }) => {
        this.delete(id);
      });
    }
  }
}
