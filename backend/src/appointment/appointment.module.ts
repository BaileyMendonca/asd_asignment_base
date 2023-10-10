/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppointmentService } from './appointmentService';
import { AppointmentController } from './appointment.controller';

@Module({
  controllers: [AppointmentController],
  providers: [PrismaService, AppointmentService],
})
export class AppointmentModule {}
