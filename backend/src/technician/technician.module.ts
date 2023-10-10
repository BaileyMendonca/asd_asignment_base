import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TechnicianService } from './technicianService';
import { TechnicianController } from './technician.controller'; 
@Module({
  controllers: [TechnicianController],
  providers: [PrismaService, TechnicianService],
})
export class TechnicianModule {}

