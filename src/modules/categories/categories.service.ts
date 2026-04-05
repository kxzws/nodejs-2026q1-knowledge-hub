import { randomUUID } from 'node:crypto';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Category } from './entities/category.entity';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  private categories = new Map<string, Category>();

  getAll() {
    return Array.from(this.categories.values());
  }

  getById(id: string) {
    const category = this.categories.get(id);

    if (!category)
      throw new NotFoundException(`Category with ID ${id} not found`);

    return category;
  }

  exists(id: string) {
    return this.categories.has(id);
  }

  create(dto: CreateCategoryDto) {
    const { name, description } = dto;

    const newCategory = {
      id: randomUUID(),
      name,
      description,
    };

    this.categories.set(newCategory.id, newCategory);

    return newCategory;
  }

  update(id: string, dto: UpdateCategoryDto) {
    const category = this.getById(id);

    this.categories.set(category.id, {
      ...category,
      ...dto,
    });

    return this.categories.get(category.id);
  }

  delete(id: string) {
    this.getById(id);

    this.categories.delete(id);

    return;
  }
}
