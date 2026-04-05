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

import { CategoriesService } from './categories.service';

import { SwaggerCategory } from './entities/category.entity';

import { GetCategoriesQueryDto } from './dto/get-categories.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Categories')
@Controller('category')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiResponse({ status: 200, type: [SwaggerCategory] })
  getAll(@Query() query: GetCategoriesQueryDto) {
    return this.categoriesService.getAll(query);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: SwaggerCategory })
  getById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.categoriesService.getById(id);
  }

  @Post()
  @ApiResponse({ status: 201, type: SwaggerCategory })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Put(':id')
  @ApiResponse({ status: 200, type: SwaggerCategory })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.categoriesService.delete(id);
  }
}
