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
  async getAll(@Query() query: GetCategoriesQueryDto) {
    return await this.categoriesService.getAll(query);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: SwaggerCategory })
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.categoriesService.getById(id);
  }

  @Post()
  @ApiResponse({ status: 201, type: SwaggerCategory })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.create(createCategoryDto);
  }

  @Put(':id')
  @ApiResponse({ status: 200, type: SwaggerCategory })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.categoriesService.delete(id);
  }
}
