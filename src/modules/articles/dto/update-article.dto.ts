import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

import { Status } from 'generated/prisma/enums';
import { Transform } from 'class-transformer';

export class UpdateArticleDto {
  @IsString()
  @MinLength(3)
  @IsOptional()
  title?: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  content?: string;

  @Transform(({ value }) => value?.toUpperCase())
  @IsEnum(Status)
  @IsOptional()
  status?: Status;

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
