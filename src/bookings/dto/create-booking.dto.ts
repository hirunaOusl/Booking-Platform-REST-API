import { IsString, IsNotEmpty, IsEmail, IsUUID, IsDateString, Matches, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the customer' })
  @IsString()
  @IsNotEmpty()
  customerName!: string;

  @ApiProperty({ example: 'johndoe@gmail.com', description: 'Contact email address' })
  @IsEmail()
  customerEmail!: string;

  @ApiProperty({ example: '+1234567890', description: 'Contact phone number' })
  @IsString()
  @IsNotEmpty()
  customerPhone!: string;

  @ApiProperty({ example: '85f92271-e737-4d69-8f0a-7b003a743b12', description: 'The UUID of the service being booked' })
  @IsUUID()
  serviceId!: string;

  @ApiProperty({ example: '2026-08-20', description: 'Target date in YYYY-MM-DD format' })
  @IsDateString()
  bookingDate!: string;

  @ApiProperty({ example: '14:30:00', description: 'Target time in 24-hour HH:MM or HH:MM:SS format' })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, {
    message: 'bookingTime must be a valid time string in HH:MM or HH:MM:SS format',
  })
  bookingTime!: string;

  @ApiProperty({ example: 'Please park in the driveway.', required: false, description: 'Optional customer notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}