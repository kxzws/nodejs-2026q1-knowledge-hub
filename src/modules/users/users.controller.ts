import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  Delete,
  HttpCode,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Roles } from 'src/common/decorators/roles.decorator';
import { RequestWithUser } from 'src/common/types/auth.types';

import { Role } from 'generated/prisma/enums';

import { UsersService } from './users.service';

import { OmittedSwaggerUser } from './entities/user.entity';

import { GetUsersQueryDto } from './dto/get-users.query.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@ApiTags('Users')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, type: [OmittedSwaggerUser] })
  @Get()
  async getAll(@Query() query: GetUsersQueryDto) {
    return await this.usersService.getAll(query);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, type: OmittedSwaggerUser })
  @Get(':id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.usersService.getById(id);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 201, type: OmittedSwaggerUser })
  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, type: OmittedSwaggerUser })
  @Put(':id')
  async updatePassword(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Req() req: RequestWithUser,
  ) {
    return await this.usersService.updatePassword(
      id,
      updatePasswordDto,
      req.user,
    );
  }

  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  @HttpCode(204)
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: RequestWithUser,
  ) {
    return await this.usersService.delete(id, req.user);
  }
}
