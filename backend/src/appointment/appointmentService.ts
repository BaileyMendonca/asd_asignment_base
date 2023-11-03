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
  // Method to search for appointments by date and technician ID

  async search(date?: string, technicianId?: number): Promise<Appointment[]> {
    try {
      const whereClause: Prisma.AppointmentWhereInput = {};

      if (date) {
        // Parse the provided date and create a range for that day
        const startDate = new Date(date);
        const endDate = new Date(date);

        // Adjust endDate to the end of the day
        endDate.setDate(startDate.getDate() + 1);
        endDate.setSeconds(endDate.getSeconds() - 1);

        whereClause.Date = {
          gte: startDate, // greater than or equal to the start of the day
          lt: endDate, // less than the end of the day
        };
      }

      if (technicianId) whereClause.TechnicianID = technicianId;

      return await this.prisma.appointment.findMany({
        where: whereClause,
      });
    } catch (error) {
      console.error(error);
      throw new Error('Error retrieving appointments');
    }
  }
}
