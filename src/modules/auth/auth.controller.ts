import { Controller, Post, Body, UseGuards, HttpCode } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

import { Public } from 'src/common/decorators/public.decorator';

import { AuthService } from './auth.service';

import { AuthenticationUserDto } from './dto/authentication-user.dto';

import { OmittedSwaggerUser } from '../users/entities/user.entity';
import { SwaggerTokens } from './entities/auth.entity';

@ApiTags('Auth')
@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({ status: 201, type: OmittedSwaggerUser })
  @Public()
  @Throttle({ auth: { limit: 10, ttl: 60000 } })
  @Post('signup')
  async signup(@Body() signupUserDto: AuthenticationUserDto) {
    return await this.authService.signup(signupUserDto);
  }

  @ApiResponse({ status: 200, type: SwaggerTokens })
  @Public()
  @Throttle({ auth: { limit: 10, ttl: 60000 } })
  @Post('login')
  @HttpCode(200)
  async login(@Body() signupUserDto: AuthenticationUserDto) {
    return await this.authService.login(signupUserDto);
  }

  @ApiResponse({ status: 200, type: SwaggerTokens })
  @Public()
  @Post('refresh')
  @HttpCode(200)
  async refresh(@Body() refreshDto) {
    return await this.authService.refresh(refreshDto);
  }
}
