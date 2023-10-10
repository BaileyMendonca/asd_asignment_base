/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
  import { AppointmentService } from './appointmentService';
  import { Appointment, Prisma } from '@prisma/client';
  
  @Controller('appointments')
  export class AppointmentController {
    constructor(private readonly appointmentService: AppointmentService) {}
  
    @Post()
    create(@Body() data: Prisma.AppointmentCreateInput) {
      return this.appointmentService.create(data);
    }
  
    @Get(':id')
    findById(@Param('id') id: number) {
      return this.appointmentService.findById(id);
    }
  
    @Get()
    findAll() {
      return this.appointmentService.findAll();
    }
  
    @Put(':id')
    update(@Param('id') id: number, @Body() data: Prisma.AppointmentUpdateInput) {
      return this.appointmentService.update(id, data);
    }
  
    @Delete(':id')
    delete(@Param('id') id: number) {
      return this.appointmentService.delete(id);
    }
  }