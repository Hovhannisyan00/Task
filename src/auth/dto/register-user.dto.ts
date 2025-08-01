import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsInt,
  Min,
  IsNotEmpty,
} from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  last_name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsInt()
  @Min(13)
  @IsNotEmpty()
  age: number;

  @IsString()
  @MinLength(6)
  @MaxLength(32)
  @IsNotEmpty()
  password: string;
}
