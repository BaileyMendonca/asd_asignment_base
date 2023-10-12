import { Injectable, Logger } from '@nestjs/common';
import { Availabilities } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AvailabilitiesService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(AvailabilitiesService.name);

  async submitLeave(availabilityData): Promise<void> {
    try {
      await this.prisma.availabilities.create({
        data: availabilityData,
      });
      this.logger.log('Complete');
    } catch (error) {
      this.logger.error('Error creating availability:', error);
    }
  }

  async getAvailabilities(email: string): Promise<Availabilities[]> {
    try {
      const availabilities = await this.prisma.availabilities.findMany({
        where: {
          email: email,
        },
      });
      this.logger.log('Complete');
      return availabilities; // Return the retrieved availabilities
    } catch (error) {
      this.logger.error('Error getting availabilities:', error);
      throw error; // Re-throw the error for error handling
    }
  }

  async deleteAvailability(id: number): Promise<void> {
    try {
      await this.prisma.availabilities.delete({
        where: {
          id,
        },
      });
      this.logger.log('Complete');
    } catch (error) {
      this.logger.error('Error deleting availability:', error);
    }
  }

  async updateAvailability(availabilityData): Promise<void> {
    try {
      await this.prisma.availabilities.update({
        where: {
          id: availabilityData.params.id,
        },
        data: {
          status: availabilityData.params.status,
        },
      });
    } catch (error) {
      this.logger.error('Error updating availability:', error);
      throw error;
    }
  }

  async getPendingAvailabilities(): Promise<Availabilities[]> {
    try {
      const availabilities = await this.prisma.availabilities.findMany({
        where: {
          status: 'Pending',
        },
      });
      this.logger.log('Complete');
      return availabilities;
    } catch (error) {
      this.logger.error('Error getting pending availabilities:', error);
      throw error;
    }
  }
}
