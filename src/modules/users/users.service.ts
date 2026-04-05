import { randomUUID } from 'node:crypto';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { Role, User } from './entities/user.entity';

import { GetUsersQueryDto } from './dto/get-users.query.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

import { SortOrder } from 'src/types';

import { getHash } from 'src/utils/hash';
import { getUserWoPassword } from 'src/utils/user';
import { getSortCb } from 'src/utils/sort';

@Injectable()
export class UsersService {
  private users = new Map<string, User>();

  constructor(private eventEmitter: EventEmitter2) {}

  getAll(query: GetUsersQueryDto) {
    const order = query.order ?? SortOrder.DESC;
    const sortBy = query.sortBy ?? 'createdAt';

    const sortedUsers = Array.from(this.users.values()).sort(
      getSortCb<User>({ order, sortBy }),
    );

    return sortedUsers.map(getUserWoPassword);
  }

  getById(id: string) {
    const user = this.users.get(id);

    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    return getUserWoPassword(user);
  }

  exists(id: string) {
    return this.users.has(id);
  }

  create(dto: CreateUserDto) {
    const { login, password, role } = dto;

    const users = this.getAll({});

    if (
      users.some(
        (user) =>
          user.login.trim().toLowerCase() === login.trim().toLowerCase(),
      )
    ) {
      throw new ConflictException(`User with such login already exists`);
    }

    const timestamp = Date.now();

    const newUser = {
      id: randomUUID(),
      login,
      password: getHash(password),
      role: role ?? Role.VIEWER,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.users.set(newUser.id, newUser);

    return getUserWoPassword(newUser);
  }

  updatePassword(id: string, dto: UpdatePasswordDto) {
    const { oldPassword, newPassword } = dto;

    const user = this.users.get(id);

    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    if (user.password === getHash(oldPassword)) {
      const timestamp = Date.now();

      this.users.set(user.id, {
        ...user,
        password: getHash(newPassword),
        updatedAt: timestamp,
      });

      return getUserWoPassword(this.users.get(user.id));
    }

    throw new ForbiddenException('Old password does not match');
  }

  delete(id: string) {
    this.getById(id);

    this.eventEmitter.emit('user.deleted', { authorId: id });

    this.users.delete(id);

    return;
  }
}
