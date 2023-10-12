import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          // url: process.env.DATABASE_URL,
          url: 'postgresql://ebroot:ASDisfun@awseb-e-n2unv8immz-stack-awsebrdsdatabase-yobdbembudcj.csul9by1mye5.us-east-1.rds.amazonaws.com:5432/ebdb',
        },
      },
    });
  }
}
