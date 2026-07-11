import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1720701600000 implements MigrationInterface {
    name = 'InitialSchema1720701600000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Create Users Table
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" varchar NOT NULL,
                "password" varchar NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_email_unique" UNIQUE ("email"),
                CONSTRAINT "PK_users" PRIMARY KEY ("id")
            )
        `);

        // 2. Create Services Table
        await queryRunner.query(`
            CREATE TABLE "services" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" varchar(150) NOT NULL,
                "description" text,
                "duration" integer NOT NULL,
                "price" decimal(10,2) NOT NULL,
                "isActive" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_services" PRIMARY KEY ("id")
            )
        `);

        // 3. Create Bookings Table
        await queryRunner.query(`
            CREATE TYPE "public"."bookings_status_enum" AS ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');
            CREATE TABLE "bookings" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "customerName" varchar NOT NULL,
                "customerEmail" varchar NOT NULL,
                "customerPhone" varchar NOT NULL,
                "bookingDate" date NOT NULL,
                "bookingTime" time NOT NULL,
                "status" "public"."bookings_status_enum" NOT NULL DEFAULT 'PENDING',
                "notes" text,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "serviceId" uuid NOT NULL,
                CONSTRAINT "PK_bookings" PRIMARY KEY ("id")
            )
        `);

        // 4. Create Foreign Key Constraint between Bookings and Services
        await queryRunner.query(`
            ALTER TABLE "bookings" 
            ADD CONSTRAINT "FK_service_booking_relation" 
            FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_service_booking_relation"`);
        await queryRunner.query(`DROP TABLE "bookings"`);
        await queryRunner.query(`DROP TYPE "public"."bookings_status_enum"`);
        await queryRunner.query(`DROP TABLE "services"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }
}