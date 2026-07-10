import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
  ) {}

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    const service = this.serviceRepo.create(createServiceDto);
    return this.serviceRepo.save(service);
  }

  async findAll(): Promise<Service[]> {
    return this.serviceRepo.find();
  }

  async findOne(id: string): Promise<Service> {
    const service = await this.serviceRepo.findOne({ where: { id } });
    if (!service) {
      throw new NotFoundException(`Service with ID "${id}" not found`);
    }
    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto): Promise<Service> {
    const service = await this.findOne(id);
    // Merge the partial changes into the existing entity
    Object.assign(service, updateServiceDto);
    return this.serviceRepo.save(service);
  }

  async remove(id: string): Promise<{ message: string }> {
    const service = await this.findOne(id);
    await this.serviceRepo.remove(service);
    return { message: `Service "${service.title}" successfully deleted` };
  }
}