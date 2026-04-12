import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

import { Role } from '../../../../generated/prisma/enums';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  login: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role; // defaults to 'viewer'
}
