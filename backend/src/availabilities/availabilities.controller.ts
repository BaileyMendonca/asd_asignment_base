import { Body, Controller, Get, Logger, Post, Query } from '@nestjs/common';
import { AvailabilitiesService } from './availabilities.service';

// In the controller decorator, we pass the path to the controller as an argument. so in the api anything with /api/... will go here
@Controller('availabilities')
export class AvailabilitiesController {
  constructor(private availabilitiesService: AvailabilitiesService) {}
  private readonly logger = new Logger(AvailabilitiesService.name);

  @Post('submitleave')
  async submitLeave(@Body() availabilityData) {
    try {
      // Basic submission logic
      const createdAvailability =
        await this.availabilitiesService.submitLeave(availabilityData);
      return createdAvailability;
    } catch (error) {
      return { error: 'An error occurred while submitting data.' };
    }
  }

  @Post('updateavailability')
  async updateAvailability(@Body() availabilityData) {
    try {
      const updatedAvailability =
        await this.availabilitiesService.updateAvailability(availabilityData);
      return updatedAvailability;
    } catch (error) {
      return { error: 'An error occurred while submitting data.' };
    }
  }

  @Get('getavailabilities')
  async getAvailabilities(@Query('email') email: string) {
    try {
      const availabilities =
        await this.availabilitiesService.getAvailabilities(email);
      this.logger.warn('Complete', availabilities);
      return availabilities;
    } catch (error) {
      this.logger.error('Error getting availabilities:', error);
      return { error: 'An error occurred while submitting data.' };
    }
  }

  @Get('getpendingavailabilities')
  async getPendingAvailabilities() {
    try {
      const availabilities =
        await this.availabilitiesService.getPendingAvailabilities();
      return availabilities;
    } catch (error) {
      this.logger.error('Error getting availabilities:', error);
      return { error: 'An error occurred while submitting data.' };
    }
  }

  @Post('deleteavailability')
  async deleteAvailability(@Body() id) {
    id = id.params.id;
    try {
      const deletedAvailability =
        await this.availabilitiesService.deleteAvailability(id);
      return deletedAvailability;
    } catch (error) {
      return { error: 'An error occurred while submitting data.' };
    }
  }
}
