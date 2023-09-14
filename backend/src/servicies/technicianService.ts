import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Technician, Prisma } from '@prisma/client'; // Importing necessary types

@Injectable()
export class TechnicianService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.TechnicianCreateInput): Promise<Technician> {
    return this.prisma.technician.create({
      data,
    });
  }

  findById(id: number): Promise<Technician | null> {
    return this.prisma.technician.findUnique({
      where: {
        id: id,
      },
    });
  }

  findAll(): Promise<Technician[]> {
    return this.prisma.technician.findMany();
  }

  update(id: number, data: Prisma.TechnicianUpdateInput): Promise<Technician> {
    return this.prisma.technician.update({
      where: {
        id: id,
      },
      data,
    });
  }

  delete(id: number): Promise<Technician> {
    return this.prisma.technician.delete({
      where: {
        id: id,
      },
    });
  }
}
