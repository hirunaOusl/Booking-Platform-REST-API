import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Service } from '../../services/entities/service.entity';

// Defines the strict structural booking operational states
export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  customerName!: string;

  @Column({ type: 'varchar' })
  customerEmail!: string;

  @Column({ type: 'varchar' })
  customerPhone!: string;

  @Column({ type: 'date' })
  bookingDate!: string; // Saved as YYYY-MM-DD string format in PostgreSQL

  @Column({ type: 'time' })
  bookingTime!: string; // Saved as HH:MM:SS string format in PostgreSQL

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status!: BookingStatus;

  @Column({ type: 'text', nullable: true })
  notes!: string;

  @CreateDateColumn()
  createdAt!: Date;

  // Many bookings can map back to a singular service profile
  @ManyToOne(() => Service, (service) => service.bookings, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'serviceId' })
  service!: Service;
}