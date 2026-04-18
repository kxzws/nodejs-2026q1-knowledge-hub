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
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

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
  @Get()
  @ApiResponse({ status: 200, type: [OmittedSwaggerUser] })
  async getAll(@Query() query: GetUsersQueryDto) {
    return await this.usersService.getAll(query);
  }

  @ApiBearerAuth('JWT-auth')
  @Get(':id')
  @ApiResponse({ status: 200, type: OmittedSwaggerUser })
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.usersService.getById(id);
  }

  @ApiBearerAuth('JWT-auth')
  @Post()
  @ApiResponse({ status: 201, type: OmittedSwaggerUser })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Put(':id')
  @ApiResponse({ status: 200, type: OmittedSwaggerUser })
  async updatePassword(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return await this.usersService.updatePassword(id, updatePasswordDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.usersService.delete(id);
  }
}
