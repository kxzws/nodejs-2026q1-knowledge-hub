import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  Delete,
  HttpCode,
  Query,
} from '@nestjs/common';

import { CommentsService } from './comments.service';

import { CreateCommentDto } from './dto/create-comment.dto';
import { GetCommentsQueryDto } from './dto/get-comments-query.dto';

@Controller('comment')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  getAllByArticleId(@Query() query: GetCommentsQueryDto) {
    return this.commentsService.getAllByArticleId(query.articleId);
  }

  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.commentsService.delete(id);
  }
}
