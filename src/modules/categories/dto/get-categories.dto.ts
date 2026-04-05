import { IsOptional, IsEnum, IsIn } from 'class-validator';

import { SortOrder } from 'src/types';

import { Category } from '../entities/category.entity';

const sortableFields: Array<keyof Category> = ['id', 'name', 'description'];

export class GetCategoriesQueryDto {
  @IsEnum(SortOrder)
  @IsOptional()
  order?: SortOrder;

  @IsIn(sortableFields)
  @IsOptional()
  sortBy?: keyof Category;
}
