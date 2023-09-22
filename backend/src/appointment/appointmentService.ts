/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Appointment, Prisma } from '@prisma/client';

@Injectable()
export class AppointmentService {
  constructor(private readonly prisma: PrismaService) {}

  // Create an appointment
  create(data: Prisma.AppointmentCreateInput): Promise<Appointment> {
    return this.prisma.appointment.create({
      data,
    });
  }

  // Find an appointment by ID
  findById(id: number): Promise<Appointment | null> {
    return this.prisma.appointment.findUnique({
      where: {
        AppointmentID: id,
      },
    });
  }

  // Get all appointments
  findAll(): Promise<Appointment[]> {
    return this.prisma.appointment.findMany();
  }

  // Update an appointment by ID
  update(
    id: number,
    data: Prisma.AppointmentUpdateInput,
  ): Promise<Appointment> {
    return this.prisma.appointment.update({
      where: {
        AppointmentID: id,
      },
      data,
    });
  }

  // Delete an appointment by ID
  delete(id: number): Promise<Appointment> {
    return this.prisma.appointment.delete({
      where: {
        AppointmentID: id,
      },
    });
  }
}
