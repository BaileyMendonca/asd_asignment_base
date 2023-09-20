import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { ServiceService } from './serviceService'; // Ensure you have a corresponding service for Service model
import { Service, Prisma } from '@prisma/client';

@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  create(@Body() data: Prisma.ServiceCreateInput) {
    // You can add custom validations here, similar to your Technician example
    return this.serviceService.create(data);
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.serviceService.findById(id);
  }

  @Get()
  findAll() {
    return this.serviceService.findAll();
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Prisma.ServiceUpdateInput) {
    return this.serviceService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.serviceService.delete(id);
  }
}
