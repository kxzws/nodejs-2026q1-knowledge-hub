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
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Roles } from 'src/common/decorators/roles.decorator';
import { RequestWithUser } from 'src/common/types/auth.types';

import { Role } from 'generated/prisma/enums';

import { CommentsService } from './comments.service';

import { SwaggerComment } from './entities/comment.entity';

import { CreateCommentDto } from './dto/create-comment.dto';
import { GetCommentsQueryDto } from './dto/get-comments-query.dto';

@ApiTags('Comments')
@Controller('comment')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, type: [SwaggerComment] })
  @Get()
  async getAllByArticleId(@Query() query: GetCommentsQueryDto) {
    return await this.commentsService.getAllByArticleId(query);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, type: SwaggerComment })
  @Get(':id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.commentsService.getById(id);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 201, type: SwaggerComment })
  @Roles(Role.ADMIN, Role.EDITOR)
  @Post()
  async create(@Body() createCommentDto: CreateCommentDto) {
    return await this.commentsService.create(createCommentDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.EDITOR)
  @Delete(':id')
  @HttpCode(204)
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: RequestWithUser,
  ) {
    return await this.commentsService.delete(id, req.user);
  }
}
