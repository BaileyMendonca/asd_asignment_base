import { Global, Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AvailabilitiesService } from './availabilities.service';
import { AvailabilitiesController } from './availabilities.controller';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [AvailabilitiesService],
  exports: [],
  controllers: [AvailabilitiesController],
})
export class AvailabilitiesModule {}
