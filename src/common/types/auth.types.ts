import { Request } from 'express';

import { Role } from 'generated/prisma/enums';

export interface ResponseUser {
  userId: string;
  login: string;
  role: Role;
}

export type RequestWithUser = Request & { user: ResponseUser };
