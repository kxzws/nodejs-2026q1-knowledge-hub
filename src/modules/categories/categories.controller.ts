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

import { Roles } from 'src/common/decorators/roles.decorator';

import { Role } from 'generated/prisma/enums';

import { CategoriesService } from './categories.service';

import { SwaggerCategory } from './entities/category.entity';

import { GetCategoriesQueryDto } from './dto/get-categories.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Categories')
@Controller('category')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, type: [SwaggerCategory] })
  @Get()
  async getAll(@Query() query: GetCategoriesQueryDto) {
    return await this.categoriesService.getAll(query);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, type: SwaggerCategory })
  @Get(':id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.categoriesService.getById(id);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 201, type: SwaggerCategory })
  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.create(createCategoryDto);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, type: SwaggerCategory })
  @Roles(Role.ADMIN)
  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoriesService.update(id, updateCategoryDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.categoriesService.delete(id);
  }
}
