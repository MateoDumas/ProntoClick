import { Module, forwardRef } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrderStatusSchedulerService } from './order-status-scheduler.service';
import { ScheduledOrdersService } from './scheduled-orders.service';
import { PrismaModule } from '../Prisma/prisma.module';
import { CouponsModule } from '../coupons/coupons.module';
import { RewardsModule } from '../rewards/rewards.module';
import { WebSocketModule } from '../websocket/websocket.module';
import { PaymentsModule } from '../payments/payments.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ReferralsModule } from '../referrals/referrals.module';

@Module({
  imports: [
    PrismaModule,
    CouponsModule,
    RewardsModule,
    PaymentsModule,
    NotificationsModule,
    ReferralsModule,
    forwardRef(() => WebSocketModule),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderStatusSchedulerService, ScheduledOrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}

