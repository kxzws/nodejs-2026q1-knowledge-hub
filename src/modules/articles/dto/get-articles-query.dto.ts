import { IsUUID, IsOptional, IsEnum, IsString } from 'class-validator';

import { Status } from '../entities/article.entity';

export class GetArticlesQueryDto {
  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  tag?: string;
}
