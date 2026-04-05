import { randomUUID } from 'node:crypto';
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { Comment } from './entities/comment.entity';

import { CreateCommentDto } from './dto/create-comment.dto';

import { ArticlesService } from '../articles/articles.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class CommentsService {
  private comments = new Map<string, Comment>();

  constructor(
    private readonly articlesService: ArticlesService,
    private readonly usersService: UsersService,
  ) {}

  getAllByArticleId(articleId: string) {
    const articleExists = this.articlesService.exists(articleId);

    if (!articleExists) {
      throw new UnprocessableEntityException(
        `Article with ID ${articleId} does not exist`,
      );
    }

    const filteredComments = Array.from(this.comments.values()).filter(
      (comment) => comment.articleId === articleId,
    );

    return filteredComments;
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
}
