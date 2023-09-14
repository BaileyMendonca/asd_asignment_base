import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TechnicianService } from '../servicies/technicianService';

@Module({
  providers: [PrismaService, TechnicianService],
})
export class TechnicianModule {}
