import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

import { Public } from 'src/common/decorators/public.decorator';

import { AuthService } from './auth.service';

import { AuthenticationUserDto } from './dto/authentication-user.dto';
import { RefreshDto } from './dto/refresh.dto';

import { OmittedSwaggerUser } from '../users/entities/user.entity';
import { SwaggerTokens } from './entities/auth.entity';

@ApiTags('Auth')
@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Throttle({ auth: { limit: 10, ttl: 60000 } })
  @Post('signup')
  @ApiResponse({ status: 201, type: OmittedSwaggerUser })
  async signup(@Body() signupUserDto: AuthenticationUserDto) {
    return await this.authService.signup(signupUserDto);
  }

  @Public()
  @Throttle({ auth: { limit: 10, ttl: 60000 } })
  @Post('login')
  @ApiResponse({ status: 200, type: SwaggerTokens })
  async login(@Body() signupUserDto: AuthenticationUserDto) {
    return await this.authService.login(signupUserDto);
  }

  @Public()
  @Post('refresh')
  @ApiResponse({ status: 200, type: SwaggerTokens })
  async refresh(@Body() refreshDto: RefreshDto) {
    return await this.authService.refresh(refreshDto);
  }
}
