import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, LoginDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(AuthService.name);

  async login(dto: LoginDto) {
    // Check the user's email exists and then compare password
    // return the user if the password is correct
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    const isPasswordValid = await argon.verify(user.password, dto.password);
    if (!user) {
      this.logger.error('User not found', dto.email);

      if (!isPasswordValid) {
        this.logger.error('invalid password', dto.email);
      }
    } else {
      // return the users email, first name, last name, and role
      return {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      };
    }
  }

  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: dto.role,
      },
    });

    delete user.password;

    return user;
  }
}
