import { Module } from '@nestjs/common';
import { ReferralsService } from './referrals.service';
import { ReferralsController } from './referrals.controller';
import { PrismaModule } from '../Prisma/prisma.module';
import { RewardsModule } from '../rewards/rewards.module';

@Module({
  imports: [PrismaModule, RewardsModule],
  controllers: [ReferralsController],
  providers: [ReferralsService],
  exports: [ReferralsService],
})
export class ReferralsModule {}

