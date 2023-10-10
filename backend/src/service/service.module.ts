/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ServiceService } from './serviceService';
import { ServiceController } from './service.controller';

@Module({
  controllers: [ServiceController],
  providers: [PrismaService, ServiceService],
})
export class ServiceModule {}
