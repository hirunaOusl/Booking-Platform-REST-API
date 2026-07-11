import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm'; // ◄ Imported "Not" here
import { Booking, BookingStatus } from './entities/booking.entity';
import { Service } from '../services/entities/service.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(Service) private readonly serviceRepo: Repository<Service>,
  ) { }

  async create(dto: CreateBookingDto): Promise<Booking> {
    // Rule 1: A booking must belong to an existing active service
    const service = await this.serviceRepo.findOne({ where: { id: dto.serviceId, isActive: true } });
    if (!service) {
      throw new NotFoundException('The requested service does not exist or is currently inactive.');
    }

    // Rule 2: Booking dates cannot be in the past
    const todayStr = new Date().toISOString().split('T')[0];
    if (dto.bookingDate < todayStr) {
      throw new BadRequestException('Booking date cannot be set in the past.');
    }

    // ✅ FIXED: Blocks slots if there is any active booking (PENDING, CONFIRMED, COMPLETED)
    const duplicate = await this.bookingRepo.findOne({
      where: {
        service: { id: dto.serviceId },
        bookingDate: dto.bookingDate,
        bookingTime: dto.bookingTime,
        status: Not(BookingStatus.CANCELLED), // ◄ Blocks everything except cancelled reservations
      },
    });

    if (duplicate) {
      throw new ConflictException('This time slot is already booked for this service.');
    }

    const booking = this.bookingRepo.create({ ...dto, service });
    return this.bookingRepo.save(booking);
  }

  // Keep all other methods (findAll, findOne, updateStatus, cancel) exactly the same...
  async findAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    status?: BookingStatus
  }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.bookingRepo.createQueryBuilder('booking')
      .leftJoinAndSelect('booking.service', 'service');

    if (query.status) {
      queryBuilder.andWhere('booking.status = :status', { status: query.status });
    }

    if (query.search) {
      queryBuilder.andWhere(
        '(booking.customerName ILIKE :search OR booking.customerEmail ILIKE :search)',
        { search: `%${query.search}%` }
      );
    }

    const [data, total] = await queryBuilder
      .orderBy('booking.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      meta: {
        totalItems: total,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({ where: { id } });
    if (!booking) {
      throw new NotFoundException(`Booking with ID "${id}" not found.`);
    }
    return booking;
  }

  async updateStatus(id: string, dto: UpdateBookingStatusDto): Promise<Booking> {
    const booking = await this.findOne(id);

    if (booking.status === BookingStatus.CANCELLED && dto.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('A cancelled booking cannot be directly marked as COMPLETED.');
    }

    booking.status = dto.status;
    return this.bookingRepo.save(booking);
  }

  async cancel(id: string): Promise<Booking> {
    return this.updateStatus(id, { status: BookingStatus.CANCELLED });
  }
}