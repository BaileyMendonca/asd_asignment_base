import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { TechnicianService } from './technicianService'
import { Technician, Prisma } from '@prisma/client';

@Controller('technicians')
export class TechnicianController {
  constructor(private readonly technicianService: TechnicianService) {}

  @Post()
  create(@Body() data: Prisma.TechnicianCreateInput) {
    return this.technicianService.create(data);
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.technicianService.findById(id);
  }

  @Get()
  findAll() {
    return this.technicianService.findAll();
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Prisma.TechnicianUpdateInput) {
    return this.technicianService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.technicianService.delete(id);
  }
}
