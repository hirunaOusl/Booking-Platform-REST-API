import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './src/auth/entities/user.entity';
import { Service } from './src/services/entities/service.entity';
import { Booking } from './src/bookings/entities/booking.entity';

dotenv.config();

export default new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'secret_password',
    database: process.env.DB_NAME || 'en2h_booking_db',
    entities: [User, Service, Booking],
    migrations: ['src/db/migrations/*.ts'],
    synchronize: false,
});