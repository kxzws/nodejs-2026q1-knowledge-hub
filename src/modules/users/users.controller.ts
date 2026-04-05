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
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';

import { OmittedSwaggerUser } from './entities/user.entity';

import { GetUsersQueryDto } from './dto/get-users.query.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@ApiTags('Users')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiResponse({ status: 200, type: [OmittedSwaggerUser] })
  getAll(@Query() query: GetUsersQueryDto) {
    return this.usersService.getAll(query);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: OmittedSwaggerUser })
  getById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.getById(id);
  }

  @Post()
  @ApiResponse({ status: 201, type: OmittedSwaggerUser })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  @ApiResponse({ status: 200, type: OmittedSwaggerUser })
  updatePassword(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.usersService.updatePassword(id, updatePasswordDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.delete(id);
  }
}
