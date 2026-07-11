import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BookingStatus } from './entities/booking.entity';

@ApiTags('Booking Management')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new client booking appointment slot (Public / Unauthenticated)' })
  @ApiResponse({ status: 201, description: 'Booking order parsed and saved successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request - Past date handling or validation failure.' })
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve all historical booking orders with pagination, filtering, and search (Authenticated Only)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination (defaults to 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of records per page (defaults to 10)' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search query matching customer name or email' })
  @ApiQuery({ name: 'status', required: false, enum: BookingStatus, description: 'Filter records by explicit booking status status' })
  findAll(
    @Query() query: { page?: number; limit?: number; search?: string; status?: BookingStatus }
  ) {
    return this.bookingsService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a specific booking invoice layout by ID (Authenticated Only)' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update state configurations manually (Authenticated Only)' })
  updateStatus(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateBookingStatusDto) {
    return this.bookingsService.updateStatus(id, dto);
  }

  @Delete(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Instantly toggle booking target array value to CANCELLED state (Authenticated Only)' })
  cancel(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookingsService.cancel(id);
  }
}