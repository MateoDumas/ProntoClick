import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (secretKey) {
      this.stripe = new Stripe(secretKey, {
        apiVersion: '2025-12-15.clover',
      });
    } else {
      console.warn('STRIPE_SECRET_KEY no configurada. Los pagos con tarjeta no estarán disponibles.');
    }
  }

  /**
   * Crea un PaymentIntent de Stripe para procesar un pago
   */
  async createPaymentIntent(
    amount: number,
    currency: string = 'usd',
    metadata?: Record<string, string>,
  ): Promise<Stripe.PaymentIntent> {
    if (!this.stripe) {
      throw new BadRequestException('Stripe no está configurado. Configura STRIPE_SECRET_KEY en .env');
    }

    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe usa centavos
        currency,
        metadata: metadata || {},
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return paymentIntent;
    } catch (error) {
      console.error('Error al crear PaymentIntent:', error);
      throw new BadRequestException('Error al procesar el pago: ' + error.message);
    }
  }

  /**
   * Confirma un pago exitoso
   */
  async confirmPayment(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    if (!this.stripe) {
      throw new BadRequestException('Stripe no está configurado');
    }

    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        return paymentIntent;
      }

      throw new BadRequestException(`El pago no fue exitoso. Estado: ${paymentIntent.status}`);
    } catch (error) {
      console.error('Error al confirmar pago:', error);
      throw new BadRequestException('Error al confirmar el pago: ' + error.message);
    }
  }

  /**
   * Verifica si Stripe está configurado
   */
  isConfigured(): boolean {
    return !!this.stripe;
  }

  /**
   * Obtiene el cliente de Stripe (para uso interno)
   */
  getStripeClient(): Stripe | null {
    return this.stripe || null;
  }
}

