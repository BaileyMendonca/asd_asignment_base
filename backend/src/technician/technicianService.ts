import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Technician, Prisma } from '@prisma/client';

@Injectable()
export class TechnicianService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.TechnicianCreateInput): Promise<Technician> {
    try {
      const createdTechnician = await this.prisma.technician.create({
        data,
      });
      return createdTechnician;
    } catch (error) {
      console.error('Error creating technician:', error);
      throw error;
    }
  }

  async findById(id: number): Promise<Technician | null> {
    try {
      const technician = await this.prisma.technician.findUnique({
        where: {
          id: id,
        },
      });

      if (!technician) {
        throw new NotFoundException(`Technician with ID ${id} not found`);
      }

      return technician;
    } catch (error) {
      console.error('Error finding technician by ID:', error);
      throw error;
    }
  }

  async findAll(): Promise<Technician[]> {
    try {
      const technicians = await this.prisma.technician.findMany();
      return technicians;
    } catch (error) {
      console.error('Error finding all technicians:', error);
      throw error;
    }
  }

  async update(id: number, data: Prisma.TechnicianUpdateInput): Promise<Technician> {
    try {
      const updatedTechnician = await this.prisma.technician.update({
        where: {
          id: id,
        },
        data,
      });
      return updatedTechnician;
    } catch (error) {
      console.error('Error updating technician:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<Technician> {
    try {
      const deletedTechnician = await this.prisma.technician.delete({
        where: {
          id: id,
        },
      });
      return deletedTechnician;
    } catch (error) {
      console.error('Error deleting technician:', error);
      throw error;
    }
  }
}
