import { OmitType } from '@nestjs/swagger';

import { Role } from 'generated/prisma/enums';

export interface User {
  id: string; // uuid v4
  login: string;
  password: string;
  role: Role;
  createdAt: string; // timestamp of creation
  updatedAt: string; // timestamp of last update
}

export class SwaggerUser implements User {
  id: string;
  login: string;
  password: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export class OmittedSwaggerUser extends OmitType(SwaggerUser, ['password']) {}
