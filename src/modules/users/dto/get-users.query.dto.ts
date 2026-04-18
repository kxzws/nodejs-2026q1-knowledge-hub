import { IsOptional, IsEnum, IsIn } from 'class-validator';

import { SortOrder } from 'src/types';

import { User } from '../entities/user.entity';

const sortableFields: Array<keyof User> = [
  'id',
  'login',
  'role',
  'createdAt',
  'updatedAt',
];

export class GetUsersQueryDto {
  @IsEnum(SortOrder)
  @IsOptional()
  order?: SortOrder;

  @IsIn(sortableFields)
  @IsOptional()
  sortBy?: keyof User;
}
