import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ServicesModule } from './services/services.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [
    // Automatically load .env file from the root directory
    ConfigModule.forRoot({ isGlobal: true }),
    
    // Configure PostgreSQL Connection
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'en2h_booking_db',
      autoLoadEntities: true, // Automatically registers schemas with 'entity.ts' extension
      synchronize: true,     // Active for development speed; disable & use migrations for production!
    }),
    AuthModule,
    ServicesModule,
    BookingsModule,
  ],
})
export class AppModule {}