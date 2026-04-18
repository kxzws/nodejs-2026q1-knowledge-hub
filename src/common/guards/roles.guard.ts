import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Role } from 'generated/prisma/enums';

import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const { user, method } = context.switchToHttp().getRequest();

    if (method === 'GET') return true;

    switch (user.role) {
      case Role.ADMIN: {
        return true;
      }

      case Role.EDITOR: {
        const className = context.getClass().name;

        if (className.includes('Categories')) {
          throw new ForbiddenException('Editors cannot manage categories');
        }

        if (method === 'POST') return true;

        return true;
      }

      case Role.VIEWER: {
        throw new ForbiddenException(
          'Viewers can only perform read operations',
        );
      }

      default: {
        return requiredRoles.some((role) => user.role?.includes(role));
      }
    }
  }
}
