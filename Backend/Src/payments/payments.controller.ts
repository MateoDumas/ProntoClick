import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../common/jwt.guard';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('create-intent')
  async createPaymentIntent(
    @Request() req,
    @Body() body: {
      amount: number;
      currency?: string;
      orderId?: string;
    },
  ) {
    if (!this.paymentsService.isConfigured()) {
      return {
        error: 'Stripe no está configurado',
        message: 'El sistema de pagos no está disponible. Usa pago en efectivo.',
      };
    }

    const paymentIntent = await this.paymentsService.createPaymentIntent(
      body.amount,
      body.currency || 'usd',
      {
        userId: req.user.id,
        orderId: body.orderId || '',
      },
    );

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }

  @Post('confirm')
  async confirmPayment(
    @Request() req,
    @Body() body: {
      paymentIntentId: string;
    },
  ) {
    const paymentIntent = await this.paymentsService.confirmPayment(body.paymentIntentId);
    
    return {
      success: true,
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100, // Convertir de centavos a dólares
    };
  }
}

