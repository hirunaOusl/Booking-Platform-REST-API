import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'staff@en2h.com', description: 'Unique administrative email' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'SecurePassword123', description: 'Plaintext password' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password!: string;
}

export class LoginDto extends RegisterDto {}