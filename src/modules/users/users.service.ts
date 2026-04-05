import { randomUUID } from 'node:crypto';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Role, User } from './entities/user.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

import { getHash } from 'src/utils/hash';
import { getUserWoPassword } from 'src/utils/user';

@Injectable()
export class UsersService {
  private users = new Map<string, User>();

  getAll() {
    return Array.from(this.users.values()).map(getUserWoPassword);
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

      return this.users.get(user.id);
    }

    throw new ForbiddenException('Old password does not match');
  }

  delete(id: string) {
    this.getById(id);

    this.users.delete(id);

    return;
  }
}
