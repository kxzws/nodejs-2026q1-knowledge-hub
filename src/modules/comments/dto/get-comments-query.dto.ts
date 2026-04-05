import { IsUUID, IsNotEmpty, IsEnum, IsOptional, IsIn } from 'class-validator';

import { SortOrder } from 'src/types';

import { Comment } from '../entities/comment.entity';

const sortableFields: Array<keyof Comment> = [
  'id',
  'content',
  'authorId',
  'createdAt',
];

export class GetCommentsQueryDto {
  @IsUUID()
  @IsNotEmpty()
  articleId: string;

  @IsEnum(SortOrder)
  @IsOptional()
  order?: SortOrder;

  @IsIn(sortableFields)
  @IsOptional()
  sortBy?: keyof Comment;
}
