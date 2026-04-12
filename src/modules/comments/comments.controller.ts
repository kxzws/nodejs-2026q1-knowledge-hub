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
  async getAllByArticleId(@Query() query: GetCommentsQueryDto) {
    return await this.commentsService.getAllByArticleId(query);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: SwaggerComment })
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.commentsService.getById(id);
  }

  @Post()
  @ApiResponse({ status: 201, type: SwaggerComment })
  async create(@Body() createCommentDto: CreateCommentDto) {
    return await this.commentsService.create(createCommentDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.commentsService.delete(id);
  }
}
