import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  Delete,
  HttpCode,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Roles } from 'src/common/decorators/roles.decorator';
import { RequestWithUser } from 'src/common/types/auth.types';

import { Role } from 'generated/prisma/enums';

import { ArticlesService } from './articles.service';

import { SwaggerArticle } from './entities/article.entity';

import { GetArticlesQueryDto } from './dto/get-articles-query.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@ApiTags('Articles')
@Controller('article')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, type: [SwaggerArticle] })
  @Get()
  async getAll(@Query() query: GetArticlesQueryDto) {
    return await this.articlesService.getAll(query);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, type: SwaggerArticle })
  @Get(':id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.articlesService.getById(id);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 201, type: SwaggerArticle })
  @Roles(Role.ADMIN, Role.EDITOR)
  @Post()
  async create(@Body() createArticleDto: CreateArticleDto) {
    return await this.articlesService.create(createArticleDto);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, type: SwaggerArticle })
  @Roles(Role.ADMIN, Role.EDITOR)
  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @Req() req: RequestWithUser,
  ) {
    return await this.articlesService.update(id, updateArticleDto, req.user);
  }

  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN, Role.EDITOR)
  @Delete(':id')
  @HttpCode(204)
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: RequestWithUser,
  ) {
    return await this.articlesService.delete(id, req.user);
  }
}
