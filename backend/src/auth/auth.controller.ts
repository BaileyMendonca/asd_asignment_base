import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Logger } from '@nestjs/common';
import { AuthDto, LoginDto } from './dto';

// In the controller decorator, we pass the path to the controller as an argument. so in the api anything with /api/... will go here
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  private readonly logger = new Logger(AuthService.name);

}
