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
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { CommentsService } from './comments.service';

import { SwaggerComment } from './entities/comment.entity';

import { CreateCommentDto } from './dto/create-comment.dto';
import { GetCommentsQueryDto } from './dto/get-comments-query.dto';

@ApiTags('Comments')
@Controller('comment')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  @ApiResponse({ status: 200, type: [SwaggerComment] })
  getAllByArticleId(@Query() query: GetCommentsQueryDto) {
    return this.commentsService.getAllByArticleId(query);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: SwaggerComment })
  getById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.commentsService.getById(id);
  }

  @Post()
  @ApiResponse({ status: 201, type: SwaggerComment })
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.commentsService.delete(id);
  }
}
