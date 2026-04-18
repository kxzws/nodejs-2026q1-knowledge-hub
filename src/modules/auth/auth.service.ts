import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { Role } from 'generated/prisma/enums';

import { UsersService } from '../users/users.service';

import { AuthenticationUserDto } from './dto/authentication-user.dto';
import { RefreshDto } from './dto/refresh.dto';

import { compareHash } from 'src/utils/hash';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async signup(dto: AuthenticationUserDto) {
    return await this.usersService.create(dto);
  }

  async login(dto: AuthenticationUserDto) {
    const { login, password } = dto;

    const user = await this.usersService.getByLogin(login);

    if (!user || !(await compareHash(password, user.password))) {
      throw new ForbiddenException(
        `No user with such login or password doesn't match`,
      );
    }

    return await this.generateTokens(user.id, user.login, user.role);
  }

  async refresh(dto: RefreshDto) {
    const { refreshToken } = dto;

    try {
      const payload = await this.jwtService.verifyAsync<{
        userId: string;
        login: string;
        role: Role;
      }>(refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET_REFRESH_KEY'),
      });

      return await this.generateTokens(
        payload.userId,
        payload.login,
        payload.role,
      );
    } catch {
      throw new ForbiddenException('Refresh token is invalid or expired');
    }
  }

  private async generateTokens(userId: string, login: string, role: Role) {
    const payload = { userId, login, role };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get<string>('TOKEN_EXPIRE_TIME'),
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get<string>('TOKEN_REFRESH_EXPIRE_TIME'),
        secret: this.configService.get<string>('JWT_SECRET_REFRESH_KEY'),
      }),
    };
  }
}
