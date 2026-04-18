import { IsUUID, IsOptional, IsEnum, IsString, IsIn } from 'class-validator';

import { Status } from 'generated/prisma/enums';

import { SortOrder } from 'src/types';

import { Article } from '../entities/article.entity';
import { Transform } from 'class-transformer';

const sortableFields: Array<keyof Article> = [
  'id',
  'title',
  'content',
  'status',
  'authorId',
  'categoryId',
  'createdAt',
  'updatedAt',
];

export class GetArticlesQueryDto {
  @Transform(({ value }) => value?.toUpperCase())
  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  tag?: string;

  @IsEnum(SortOrder)
  @IsOptional()
  order?: SortOrder;

  @IsIn(sortableFields)
  @IsOptional()
  sortBy?: keyof Article;
}
