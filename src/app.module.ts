import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ServicesModule } from './services/services.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [
    // Automatically load .env file parameters from the root directory
    ConfigModule.forRoot({ isGlobal: true }),

    // Configure PostgreSQL Connection
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'secret_password',
      database: process.env.DB_NAME || 'en2h_booking_db',
      autoLoadEntities: true,
      synchronize: false,

      // Registers the tracking files context into the runtime framework instance
      migrations: [__dirname + '/db/migrations/*{.ts,.js}'],
      migrationsRun: true, // Automatically runs pending migrations on app startup!
    }),
    AuthModule,
    ServicesModule,
    BookingsModule,
  ],
})
export class AppModule { }