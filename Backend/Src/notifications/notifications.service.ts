import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private isConfigured = false;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
    const fromEmail = this.configService.get<string>('FROM_EMAIL') || 'noreply@prontoclick.com';

    if (apiKey) {
      sgMail.setApiKey(apiKey);
      this.isConfigured = true;
      this.logger.log('SendGrid configurado correctamente');
    } else {
      this.logger.warn('SendGrid no está configurado. Los emails no se enviarán.');
    }
  }

  /**
   * Envía email de confirmación de pedido
   */
  async sendOrderConfirmationEmail(
    userEmail: string,
    userName: string,
    orderId: string,
    orderTotal: number,
    orderItems: Array<{ name: string; quantity: number; price: number }>,
  ): Promise<boolean> {
    if (!this.isConfigured) {
      this.logger.warn('SendGrid no configurado. Email no enviado.');
      return false;
    }

    try {
      const fromEmail = this.configService.get<string>('FROM_EMAIL') || 'noreply@prontoclick.com';
      
      const itemsHtml = orderItems
        .map((item) => `<li>${item.quantity}x ${item.name} - $${item.price.toFixed(2)}</li>`)
        .join('');

      const msg = {
        to: userEmail,
        from: fromEmail,
        subject: `¡Pedido #${orderId.substring(0, 8)} confirmado!`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .order-info { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
              .items { margin: 15px 0; }
              .items ul { list-style: none; padding: 0; }
              .items li { padding: 8px 0; border-bottom: 1px solid #eee; }
              .total { font-size: 20px; font-weight: bold; color: #667eea; margin-top: 20px; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>¡Pedido Confirmado!</h1>
                <p>Gracias por tu compra, ${userName}</p>
              </div>
              <div class="content">
                <p>Tu pedido ha sido confirmado y está siendo preparado.</p>
                
                <div class="order-info">
                  <h3>Detalles del Pedido</h3>
                  <p><strong>Número de pedido:</strong> #${orderId.substring(0, 8)}</p>
                  
                  <div class="items">
                    <h4>Items:</h4>
                    <ul>${itemsHtml}</ul>
                  </div>
                  
                  <div class="total">
                    Total: $${orderTotal.toFixed(2)}
                  </div>
                </div>
                
                <p>Recibirás una notificación cuando tu pedido esté en camino.</p>
              </div>
              <div class="footer">
                <p>ProntoClick - Tu comida favorita, a un click de distancia</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      await sgMail.send(msg);
      this.logger.log(`Email de confirmación enviado a ${userEmail}`);
      return true;
    } catch (error) {
      this.logger.error(`Error al enviar email a ${userEmail}:`, error);
      return false;
    }
  }

  /**
   * Envía email de bienvenida
   */
  async sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
    if (!this.isConfigured) {
      this.logger.warn('SendGrid no configurado. Email no enviado.');
      return false;
    }

    try {
      const fromEmail = this.configService.get<string>('FROM_EMAIL') || 'noreply@prontoclick.com';
      
      const msg = {
        to: userEmail,
        from: fromEmail,
        subject: '¡Bienvenido a ProntoClick!',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>¡Bienvenido a ProntoClick!</h1>
              </div>
              <div class="content">
                <p>Hola ${userName},</p>
                <p>¡Gracias por unirte a ProntoClick! Estamos emocionados de tenerte con nosotros.</p>
                <p>Ahora puedes:</p>
                <ul>
                  <li>Explorar restaurantes y productos</li>
                  <li>Realizar pedidos rápidos y seguros</li>
                  <li>Ganar puntos con cada compra</li>
                  <li>Canjear recompensas exclusivas</li>
                </ul>
                <p>¡Que disfrutes tu experiencia con ProntoClick!</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      await sgMail.send(msg);
      this.logger.log(`Email de bienvenida enviado a ${userEmail}`);
      return true;
    } catch (error) {
      this.logger.error(`Error al enviar email de bienvenida a ${userEmail}:`, error);
      return false;
    }
  }

  /**
   * Envía email de cambio de estado de pedido
   */
  async sendOrderStatusUpdateEmail(
    userEmail: string,
    userName: string,
    orderId: string,
    status: string,
    statusMessage: string,
  ): Promise<boolean> {
    if (!this.isConfigured) {
      this.logger.warn('SendGrid no configurado. Email no enviado.');
      return false;
    }

    try {
      const fromEmail = this.configService.get<string>('FROM_EMAIL') || 'noreply@prontoclick.com';
      
      const statusLabels: Record<string, string> = {
        confirmed: 'Confirmado',
        preparing: 'En preparación',
        ready: 'Listo para entrega',
        delivered: 'Entregado',
        cancelled: 'Cancelado',
      };

      const msg = {
        to: userEmail,
        from: fromEmail,
        subject: `Actualización de tu pedido #${orderId.substring(0, 8)}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Actualización de Pedido</h1>
              </div>
              <div class="content">
                <p>Hola ${userName},</p>
                <p>Tu pedido #${orderId.substring(0, 8)} ha sido actualizado:</p>
                <p><strong>Estado:</strong> ${statusLabels[status] || status}</p>
                <p><strong>Mensaje:</strong> ${statusMessage}</p>
                <p>Puedes ver el estado de tu pedido en tiempo real desde la app.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      await sgMail.send(msg);
      this.logger.log(`Email de actualización enviado a ${userEmail}`);
      return true;
    } catch (error) {
      this.logger.error(`Error al enviar email de actualización a ${userEmail}:`, error);
      return false;
    }
  }

  /**
   * Verifica si el servicio está configurado
   */
  isEmailConfigured(): boolean {
    return this.isConfigured;
  }
}

