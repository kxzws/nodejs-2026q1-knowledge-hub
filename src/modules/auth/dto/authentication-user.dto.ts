import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthenticationUserDto {
  @IsString()
  @MinLength(3)
  login: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
