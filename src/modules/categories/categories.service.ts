import { Injectable, NotFoundException } from '@nestjs/common';

import { GetCategoriesQueryDto } from './dto/get-categories.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

import { PrismaService } from 'src/prisma/prisma.service';

import { SortOrder } from 'src/types';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(query: GetCategoriesQueryDto) {
    const order = query.order ?? SortOrder.ASC;
    const sortBy = query.sortBy ?? 'name';

    return await this.prisma.category.findMany({
      orderBy: {
        [sortBy]: order,
      },
    });
  }

  async getById(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { articles: true },
    });

    if (!category)
      throw new NotFoundException(`Category with ID ${id} not found`);

    return category;
  }

  async exists(id: string) {
    if (!id) return false;

    const category = await this.prisma.category.findUnique({ where: { id } });

    return !!category;
  }

  async create(dto: CreateCategoryDto) {
    return await this.prisma.category.create({ data: dto });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    return await this.prisma.category.update({
      where: { id },
      data: dto,
      include: { articles: true },
    });
  }

  async delete(id: string) {
    await this.getById(id);

    await this.prisma.category.delete({ where: { id } });

    return;
  }
}
