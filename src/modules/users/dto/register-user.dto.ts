import {
  IsEmail,
  IsString,
  IsInt,
  MinLength,
  MaxLength,
  Min,
} from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @MinLength(2)
  first_name: string;

  @IsString()
  @MinLength(2)
  last_name: string;

  @IsEmail()
  email: string;

  @IsInt()
  @Min(13)
  age: number;

  @IsString()
  @MinLength(6)
  @MaxLength(32)
  password: string;
}
