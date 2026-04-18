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
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { ArticlesService } from './articles.service';

import { SwaggerArticle } from './entities/article.entity';

import { GetArticlesQueryDto } from './dto/get-articles-query.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@ApiTags('Articles')
@Controller('article')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  @ApiResponse({ status: 200, type: [SwaggerArticle] })
  getAll(@Query() query: GetArticlesQueryDto) {
    return this.articlesService.getAll(query);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: SwaggerArticle })
  getById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.articlesService.getById(id);
  }

  @Post()
  @ApiResponse({ status: 201, type: SwaggerArticle })
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(createArticleDto);
  }

  @Put(':id')
  @ApiResponse({ status: 200, type: SwaggerArticle })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articlesService.update(id, updateArticleDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.articlesService.delete(id);
  }
}
