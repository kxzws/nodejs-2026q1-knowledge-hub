import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Status } from '../../../generated/prisma/enums';

import { GetUsersQueryDto } from './dto/get-users.query.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

import { PrismaService } from 'src/prisma/prisma.service';

import { SortOrder } from 'src/types';

import { getHash, compareHash } from 'src/utils/hash';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(query: GetUsersQueryDto) {
    const order = query.order ?? SortOrder.DESC;
    const sortBy = query.sortBy ?? 'createdAt';

    return await this.prisma.user.findMany({
      orderBy: {
        [sortBy]: order,
      },
      omit: {
        password: true,
      },
      // include: {
      //   articles: true,
      //   comments: true,
      // },
    });
  }

  async getById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      omit: {
        password: true,
      },
      include: {
        articles: true,
        comments: true,
      },
    });

    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    return user;
  }

  async getByLogin(login: string) {
    return await this.prisma.user.findUnique({
      where: { login },
    });
  }

  async exists(id: string) {
    if (!id) return false;

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return !!user;
  }

  async create(dto: CreateUserDto) {
    const { password } = dto;

    return await this.prisma.user.create({
      data: {
        ...dto,
        password: await getHash(password),
      },
      omit: {
        password: true,
      },
    });
  }

  async updatePassword(id: string, dto: UpdatePasswordDto) {
    const { oldPassword, newPassword } = dto;

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    if (await compareHash(oldPassword, user.password)) {
      return await this.prisma.user.update({
        where: { id },
        data: {
          password: await getHash(newPassword),
        },
        omit: {
          password: true,
        },
        include: {
          articles: true,
          comments: true,
        },
      });
    }

    throw new ForbiddenException('Old password does not match');
  }

  async delete(id: string) {
    await this.getById(id);

    return await this.prisma.$transaction(async (tx) => {
      await tx.article.updateMany({
        where: { authorId: id },
        data: { status: Status.DRAFT },
      });

      await tx.user.delete({
        where: { id },
      });

      return;
    });
  }
}
