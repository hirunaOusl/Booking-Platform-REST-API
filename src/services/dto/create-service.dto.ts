import { IsString, IsNotEmpty, IsOptional, IsInt, IsNumber, IsBoolean, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({ example: 'Premium System Audit' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'Comprehensive engineering infrastructure review', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 60, description: 'Duration in minutes' })
  @IsInt()
  @Min(1)
  duration!: number;

  @ApiProperty({ example: 150.00 })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty({ example: true, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}