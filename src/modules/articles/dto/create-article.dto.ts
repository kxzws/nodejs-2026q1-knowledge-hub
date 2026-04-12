import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

import { Status } from '../../../../generated/prisma/enums';
import { Transform } from 'class-transformer';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  content: string;

  @Transform(({ value }) => value?.toUpperCase())
  @IsEnum(Status)
  @IsOptional()
  status?: Status; // defaults to 'draft'

  @IsUUID(4)
  @IsOptional()
  authorId?: string;

  @IsUUID(4)
  @IsOptional()
  categoryId?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
