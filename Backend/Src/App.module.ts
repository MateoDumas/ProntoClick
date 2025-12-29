import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { OrdersModule } from './orders/orders.module';
import { PrismaModule } from './Prisma/prisma.module';
import { SearchModule } from './search/search.module';
import { FavoritesModule } from './favorites/favorites.module';
import { PromotionsModule } from './promotions/promotions.module';
import { MarketModule } from './market/market.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AddressesModule } from './addresses/addresses.module';
import { CouponsModule } from './coupons/coupons.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { RewardsModule } from './rewards/rewards.module';
import { WebSocketModule } from './websocket/websocket.module';
import { PaymentsModule } from './payments/payments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { UploadModule } from './upload/upload.module';
import { ReferralsModule } from './referrals/referrals.module';
import { SavedListsModule } from './saved-lists/saved-lists.module';
import { ReportsModule } from './reports/reports.module';
import { ChatModule } from './chat/chat.module';
import { SupportModule } from './support/support.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Rate Limiting - Protección contra DDoS y fuerza bruta
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000, // 1 minuto en milisegundos
          limit: 100, // 100 requests por minuto por IP
        },
      ],
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    RestaurantsModule,
    OrdersModule,
    SearchModule,
    FavoritesModule,
    PromotionsModule,
    MarketModule,
    ReviewsModule,
    AddressesModule,
    CouponsModule,
    RecommendationsModule,
    RewardsModule,
    WebSocketModule,
    PaymentsModule,
    NotificationsModule,
    UploadModule,
    ReferralsModule,
    SavedListsModule,
    ReportsModule,
    ChatModule,
    SupportModule,
  ],
  providers: [
    // Aplicar rate limiting globalmente
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

