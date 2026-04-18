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
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

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
  @Get()
  @ApiResponse({ status: 200, type: [SwaggerArticle] })
  async getAll(@Query() query: GetArticlesQueryDto) {
    return await this.articlesService.getAll(query);
  }

  @ApiBearerAuth('JWT-auth')
  @Get(':id')
  @ApiResponse({ status: 200, type: SwaggerArticle })
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.articlesService.getById(id);
  }

  @ApiBearerAuth('JWT-auth')
  @Post()
  @ApiResponse({ status: 201, type: SwaggerArticle })
  async create(@Body() createArticleDto: CreateArticleDto) {
    return await this.articlesService.create(createArticleDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Put(':id')
  @ApiResponse({ status: 200, type: SwaggerArticle })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return await this.articlesService.update(id, updateArticleDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.articlesService.delete(id);
  }
}
