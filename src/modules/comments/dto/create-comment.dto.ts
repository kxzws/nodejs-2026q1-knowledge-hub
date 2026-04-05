import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  content: string;

  @IsUUID(4)
  @IsNotEmpty()
  articleId: string;

  @IsUUID(4)
  @IsOptional()
  authorId?: string;
}
