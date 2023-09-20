import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Service, Prisma } from '@prisma/client';

@Injectable()
export class ServiceService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.ServiceCreateInput): Promise<Service> {
    return this.prisma.service.create({
      data,
    });
  }

  findById(id: number): Promise<Service | null> {
    return this.prisma.service.findUnique({
      where: {
        id: id,
      },
    });
  }

  findAll(): Promise<Service[]> {
    return this.prisma.service.findMany();
  }

  update(id: number, data: Prisma.ServiceUpdateInput): Promise<Service> {
    return this.prisma.service.update({
      where: {
        id: id,
      },
      data,
    });
  }

  delete(id: number): Promise<Service> {
    return this.prisma.service.delete({
      where: {
        id: id,
      },
    });
  }
}
