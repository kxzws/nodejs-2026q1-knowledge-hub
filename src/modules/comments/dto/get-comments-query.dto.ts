import { IsUUID, IsNotEmpty } from 'class-validator';

export class GetCommentsQueryDto {
  @IsUUID()
  @IsNotEmpty()
  articleId: string;
}
