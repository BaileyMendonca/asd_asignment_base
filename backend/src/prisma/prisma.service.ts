// import { Injectable } from '@nestjs/common';
// import { PrismaClient } from '@prisma/client';

// @Injectable()
// export class PrismaService extends PrismaClient {
//   constructor() {
//     super({
//       datasources: {
//         db: {
//           url: process.env.DATABASE_URL,
//         },
//       },
//     });
//   }
// }

import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
  
  constructor() {
    super({
      datasources: {
        db: {
          //url: process.env.DATABASE_URL,
          url: 'postgresql://ebroot:ebroot@awseb-e-n2unv8immz-stack-awsebrdsdatabase-yobdbembudcj.csul9by1mye5.us-east-1.rds.amazonaws.com:5432/nest?schema=public',
        },
      },
    });
  }
}

