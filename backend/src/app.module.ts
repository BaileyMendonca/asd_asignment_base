/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { TechnicianModule } from './technician/technician.module';
import { ServiceModule } from './service/service.module';
import { AppointmentModule } from './appointment/appointment.module';
//import { TechnicianController } from './technician/technician.controller'; 
//import { TechnicianService } from './technician/technicianservice'; 
@Module({
  imports: [
    AuthModule,
    PrismaModule,
    TechnicianModule,
    ServiceModule,
    AppointmentModule,
  ],
  // controllers: [],
  // providers: [],
 // controllers: [TechnicianController],
   // providers: [TechnicianService],
})
export class AppModule {}
