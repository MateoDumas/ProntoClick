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
      const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'https://pronto-click.vercel.app';
      
      const msg = {
        to: userEmail,
        from: fromEmail,
        subject: '¡Bienvenido a ProntoClick! Tu cuenta ha sido confirmada 🎉',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
                line-height: 1.6; 
                color: #333; 
                background-color: #f4f4f4;
              }
              .email-container { 
                max-width: 600px; 
                margin: 0 auto; 
                background-color: #ffffff;
              }
              .header { 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color: white; 
                padding: 40px 30px; 
                text-align: center; 
              }
              .header h1 { 
                font-size: 32px; 
                margin-bottom: 10px;
                font-weight: 700;
              }
              .header p { 
                font-size: 18px; 
                opacity: 0.95;
              }
              .content { 
                padding: 40px 30px; 
              }
              .welcome-message {
                font-size: 18px;
                color: #667eea;
                font-weight: 600;
                margin-bottom: 20px;
              }
              .confirmation-box {
                background: linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%);
                border-left: 4px solid #667eea;
                padding: 20px;
                margin: 25px 0;
                border-radius: 8px;
              }
              .confirmation-box h2 {
                color: #667eea;
                font-size: 20px;
                margin-bottom: 10px;
              }
              .benefits {
                background: #f9f9f9;
                padding: 25px;
                border-radius: 8px;
                margin: 25px 0;
              }
              .benefits h3 {
                color: #333;
                font-size: 20px;
                margin-bottom: 15px;
                text-align: center;
              }
              .benefits-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin-top: 15px;
              }
              .benefit-item {
                background: white;
                padding: 15px;
                border-radius: 8px;
                text-align: center;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .benefit-icon {
                font-size: 32px;
                margin-bottom: 8px;
              }
              .benefit-title {
                font-weight: 600;
                color: #667eea;
                margin-bottom: 5px;
              }
              .benefit-desc {
                font-size: 13px;
                color: #666;
              }
              .promo-box {
                background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
                color: white;
                padding: 25px;
                border-radius: 8px;
                margin: 25px 0;
                text-align: center;
              }
              .promo-box h3 {
                font-size: 24px;
                margin-bottom: 10px;
              }
              .promo-code {
                background: white;
                color: #ff6b6b;
                padding: 12px 20px;
                border-radius: 6px;
                font-size: 20px;
                font-weight: 700;
                display: inline-block;
                margin: 15px 0;
                letter-spacing: 2px;
              }
              .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 40px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
                margin: 20px 0;
                text-align: center;
                box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);
              }
              .steps {
                margin: 25px 0;
              }
              .step {
                display: flex;
                align-items: flex-start;
                margin-bottom: 20px;
              }
              .step-number {
                background: #667eea;
                color: white;
                width: 35px;
                height: 35px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                margin-right: 15px;
                flex-shrink: 0;
              }
              .step-content h4 {
                color: #333;
                margin-bottom: 5px;
              }
              .step-content p {
                color: #666;
                font-size: 14px;
              }
              .footer { 
                background: #2c3e50;
                color: #ecf0f1;
                padding: 30px;
                text-align: center;
                font-size: 14px;
              }
              .footer a {
                color: #667eea;
                text-decoration: none;
              }
              .social-links {
                margin: 20px 0;
              }
              .social-links a {
                display: inline-block;
                margin: 0 10px;
                color: #ecf0f1;
                text-decoration: none;
              }
              @media only screen and (max-width: 600px) {
                .benefits-grid {
                  grid-template-columns: 1fr;
                }
                .header h1 {
                  font-size: 24px;
                }
                .content {
                  padding: 25px 20px;
                }
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <h1>🎉 ¡Bienvenido a ProntoClick!</h1>
                <p>Tu cuenta ha sido confirmada exitosamente</p>
              </div>
              
              <div class="content">
                <p class="welcome-message">Hola ${userName},</p>
                
                <p style="font-size: 16px; margin-bottom: 20px;">
                  ¡Estamos emocionados de tenerte con nosotros! Tu cuenta ha sido creada y confirmada correctamente. 
                  Ahora puedes disfrutar de todos los beneficios que ProntoClick tiene para ofrecerte.
                </p>

                <div class="confirmation-box">
                  <h2>✅ Cuenta Confirmada</h2>
                  <p style="margin: 0; color: #555;">
                    Tu email <strong>${userEmail}</strong> ha sido verificado y tu cuenta está lista para usar. 
                    Ya puedes iniciar sesión y comenzar a pedir.
                  </p>
                </div>

                <div class="promo-box">
                  <h3>🎁 ¡Descuento Especial de Bienvenida!</h3>
                  <p style="margin-bottom: 15px;">Usa este código en tu primer pedido:</p>
                  <div class="promo-code">BIENVENIDA10</div>
                  <p style="font-size: 14px; opacity: 0.9;">10% de descuento en tu primer pedido</p>
                </div>

                <div class="benefits">
                  <h3>🌟 ¿Qué puedes hacer en ProntoClick?</h3>
                  <div class="benefits-grid">
                    <div class="benefit-item">
                      <div class="benefit-icon">🍕</div>
                      <div class="benefit-title">Explorar</div>
                      <div class="benefit-desc">Restaurantes y productos</div>
                    </div>
                    <div class="benefit-item">
                      <div class="benefit-icon">⚡</div>
                      <div class="benefit-title">Pedidos Rápidos</div>
                      <div class="benefit-desc">Entrega en minutos</div>
                    </div>
                    <div class="benefit-item">
                      <div class="benefit-icon">⭐</div>
                      <div class="benefit-title">ProntoPuntos</div>
                      <div class="benefit-desc">Gana con cada compra</div>
                    </div>
                    <div class="benefit-item">
                      <div class="benefit-icon">🎁</div>
                      <div class="benefit-title">Recompensas</div>
                      <div class="benefit-desc">Canjea puntos</div>
                    </div>
                  </div>
                </div>

                <div class="steps">
                  <h3 style="color: #333; margin-bottom: 20px; text-align: center;">🚀 Cómo Empezar</h3>
                  
                  <div class="step">
                    <div class="step-number">1</div>
                    <div class="step-content">
                      <h4>Explora Restaurantes</h4>
                      <p>Descubre una amplia variedad de restaurantes y productos de diferentes culturas.</p>
                    </div>
                  </div>
                  
                  <div class="step">
                    <div class="step-number">2</div>
                    <div class="step-content">
                      <h4>Agrega al Carrito</h4>
                      <p>Selecciona tus productos favoritos y agrégalos a tu carrito de compras.</p>
                    </div>
                  </div>
                  
                  <div class="step">
                    <div class="step-number">3</div>
                    <div class="step-content">
                      <h4>Realiza tu Pedido</h4>
                      <p>Usa el código BIENVENIDA10 para obtener 10% de descuento en tu primer pedido.</p>
                    </div>
                  </div>
                  
                  <div class="step">
                    <div class="step-number">4</div>
                    <div class="step-content">
                      <h4>Gana ProntoPuntos</h4>
                      <p>Con cada compra gana puntos que puedes canjear por recompensas exclusivas.</p>
                    </div>
                  </div>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                  <a href="${frontendUrl}" class="cta-button">Comenzar a Pedir Ahora</a>
                </div>

                <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 30px;">
                  <h4 style="color: #333; margin-bottom: 10px;">💡 Consejos para aprovechar al máximo:</h4>
                  <ul style="color: #666; padding-left: 20px; margin: 0;">
                    <li style="margin-bottom: 8px;">Guarda tus direcciones favoritas para pedidos más rápidos</li>
                    <li style="margin-bottom: 8px;">Revisa las promociones diarias para obtener mejores descuentos</li>
                    <li style="margin-bottom: 8px;">Invita amigos y gana puntos adicionales con el programa de referidos</li>
                    <li>Canjea tus ProntoPuntos por cupones y recompensas exclusivas</li>
                  </ul>
                </div>

                <p style="margin-top: 30px; color: #666; font-size: 14px; text-align: center;">
                  Si tienes alguna pregunta, nuestro equipo de soporte está disponible 24/7 para ayudarte.
                </p>
              </div>

              <div class="footer">
                <p style="margin-bottom: 15px;">
                  <strong>ProntoClick</strong><br>
                  Tu comida favorita, a un click de distancia
                </p>
                <div class="social-links">
                  <a href="${frontendUrl}">Visita nuestro sitio</a> |
                  <a href="${frontendUrl}/support">Soporte</a> |
                  <a href="${frontendUrl}/rewards">Recompensas</a>
                </div>
                <p style="margin-top: 20px; font-size: 12px; color: #95a5a6;">
                  Este es un email automático, por favor no respondas a este mensaje.<br>
                  © ${new Date().getFullYear()} ProntoClick. Todos los derechos reservados.
                </p>
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
   * Envía email con código de verificación
   */
  async sendVerificationCodeEmail(userEmail: string, userName: string, verificationCode: string): Promise<boolean> {
    if (!this.isConfigured) {
      this.logger.warn('SendGrid no configurado. Email no enviado.');
      return false;
    }

    try {
      const fromEmail = this.configService.get<string>('FROM_EMAIL') || 'noreply@prontoclick.com';
      const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'https://pronto-click.vercel.app';
      
      const msg = {
        to: userEmail,
        from: fromEmail,
        subject: '🔐 Código de Verificación - ProntoClick',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
                line-height: 1.6; 
                color: #333; 
                background-color: #f4f4f4;
              }
              .email-container { 
                max-width: 600px; 
                margin: 0 auto; 
                background-color: #ffffff;
              }
              .header { 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color: white; 
                padding: 40px 30px; 
                text-align: center; 
              }
              .header h1 { 
                font-size: 32px; 
                margin-bottom: 10px;
                font-weight: 700;
              }
              .content { 
                padding: 40px 30px; 
              }
              .code-box {
                background: linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%);
                border: 2px dashed #667eea;
                padding: 30px;
                margin: 30px 0;
                border-radius: 12px;
                text-align: center;
              }
              .verification-code {
                font-size: 48px;
                font-weight: 700;
                color: #667eea;
                letter-spacing: 8px;
                font-family: 'Courier New', monospace;
                margin: 20px 0;
              }
              .code-label {
                font-size: 14px;
                color: #666;
                text-transform: uppercase;
                letter-spacing: 2px;
                margin-bottom: 10px;
              }
              .warning-box {
                background: #fff3cd;
                border-left: 4px solid #ffc107;
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
              }
              .footer { 
                background: #2c3e50;
                color: #ecf0f1;
                padding: 30px;
                text-align: center;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <h1>🔐 Verifica tu Email</h1>
                <p>Completa tu registro en ProntoClick</p>
              </div>
              
              <div class="content">
                <p style="font-size: 16px; margin-bottom: 20px;">
                  Hola <strong>${userName}</strong>,
                </p>
                
                <p style="font-size: 16px; margin-bottom: 20px;">
                  Gracias por registrarte en ProntoClick. Para completar tu registro y comenzar a usar tu cuenta, 
                  necesitas verificar tu dirección de email usando el código que aparece a continuación.
                </p>

                <div class="code-box">
                  <div class="code-label">Tu código de verificación</div>
                  <div class="verification-code">${verificationCode}</div>
                  <p style="font-size: 14px; color: #666; margin-top: 15px;">
                    Este código expira en 15 minutos
                  </p>
                </div>

                <div class="warning-box">
                  <p style="margin: 0; color: #856404;">
                    <strong>⚠️ Importante:</strong> No compartas este código con nadie. Si no solicitaste este código, 
                    puedes ignorar este email de forma segura.
                  </p>
                </div>

                <p style="font-size: 14px; color: #666; margin-top: 30px; text-align: center;">
                  Si tienes problemas, puedes solicitar un nuevo código desde la página de verificación.
                </p>
              </div>

              <div class="footer">
                <p style="margin-bottom: 15px;">
                  <strong>ProntoClick</strong><br>
                  Tu comida favorita, a un click de distancia
                </p>
                <p style="margin-top: 20px; font-size: 12px; color: #95a5a6;">
                  Este es un email automático, por favor no respondas a este mensaje.<br>
                  © ${new Date().getFullYear()} ProntoClick. Todos los derechos reservados.
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      await sgMail.send(msg);
      this.logger.log(`Email de verificación enviado a ${userEmail}`);
      return true;
    } catch (error) {
      this.logger.error(`Error al enviar email de verificación a ${userEmail}:`, error);
      return false;
    }
  }

  /**
   * Envía email con código de recuperación de contraseña
   */
  async sendPasswordResetEmail(userEmail: string, userName: string, resetCode: string): Promise<boolean> {
    if (!this.isConfigured) {
      this.logger.warn('SendGrid no configurado. Email no enviado.');
      return false;
    }

    try {
      const fromEmail = this.configService.get<string>('FROM_EMAIL') || 'noreply@prontoclick.com';
      
      const msg = {
        to: userEmail,
        from: fromEmail,
        subject: '🔑 Recuperación de Contraseña - ProntoClick',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
                line-height: 1.6; 
                color: #333; 
                background-color: #f4f4f4;
              }
              .email-container { 
                max-width: 600px; 
                margin: 0 auto;
                background: white;
              }
              .header {
                background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
              }
              .header h1 {
                font-size: 28px;
                margin-bottom: 10px;
              }
              .content {
                padding: 40px 30px;
              }
              .code-box {
                background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
                border: 2px solid #dc2626;
                border-radius: 12px;
                padding: 30px;
                text-align: center;
                margin: 30px 0;
              }
              .code-label {
                font-size: 14px;
                color: #666;
                margin-bottom: 10px;
                text-transform: uppercase;
                letter-spacing: 1px;
              }
              .reset-code {
                font-size: 36px;
                font-weight: 700;
                color: #dc2626;
                letter-spacing: 8px;
                font-family: 'Courier New', monospace;
                margin: 15px 0;
              }
              .warning-box {
                background: #fff3cd;
                border-left: 4px solid #ffc107;
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
              }
              .footer { 
                background: #2c3e50;
                color: #ecf0f1;
                padding: 30px;
                text-align: center;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <h1>🔑 Recuperación de Contraseña</h1>
                <p>Restablece tu contraseña de ProntoClick</p>
              </div>
              
              <div class="content">
                <p style="font-size: 16px; margin-bottom: 20px;">
                  Hola <strong>${userName}</strong>,
                </p>
                
                <p style="font-size: 16px; margin-bottom: 20px;">
                  Recibimos una solicitud para restablecer la contraseña de tu cuenta en ProntoClick. 
                  Si no fuiste tú, puedes ignorar este email de forma segura.
                </p>

                <div class="code-box">
                  <div class="code-label">Tu código de recuperación</div>
                  <div class="reset-code">${resetCode}</div>
                  <p style="font-size: 14px; color: #666; margin-top: 15px;">
                    Este código expira en 15 minutos
                  </p>
                </div>

                <p style="font-size: 16px; margin-top: 30px;">
                  Ingresa este código en la página de recuperación de contraseña para crear una nueva contraseña.
                </p>

                <div class="warning-box">
                  <p style="margin: 0; color: #856404;">
                    <strong>⚠️ Importante:</strong> No compartas este código con nadie. Si no solicitaste este cambio, 
                    tu cuenta permanecerá segura.
                  </p>
                </div>
              </div>

              <div class="footer">
                <p style="margin-bottom: 15px;">
                  <strong>ProntoClick</strong><br>
                  Tu comida favorita, a un click de distancia
                </p>
                <p style="margin-top: 20px; font-size: 12px; color: #95a5a6;">
                  Este es un email automático, por favor no respondas a este mensaje.<br>
                  © ${new Date().getFullYear()} ProntoClick. Todos los derechos reservados.
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      await sgMail.send(msg);
      this.logger.log(`Email de recuperación de contraseña enviado a ${userEmail}`);
      return true;
    } catch (error) {
      this.logger.error(`Error al enviar email de recuperación a ${userEmail}:`, error);
      return false;
    }
  }

  /**
   * Envía email de notificación de inicio de sesión
   */
  async sendLoginNotificationEmail(
    userEmail: string,
    userName: string,
    loginTime: Date,
    ipAddress?: string,
    deviceInfo?: string,
  ): Promise<boolean> {
    if (!this.isConfigured) {
      this.logger.warn('SendGrid no configurado. Email no enviado.');
      return false;
    }

    try {
      const fromEmail = this.configService.get<string>('FROM_EMAIL') || 'noreply@prontoclick.com';
      const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'https://pronto-click.vercel.app';
      
      const formattedTime = loginTime.toLocaleString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      });

      const msg = {
        to: userEmail,
        from: fromEmail,
        subject: '🔐 Nueva sesión iniciada en tu cuenta - ProntoClick',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
                line-height: 1.6; 
                color: #333; 
                background-color: #f4f4f4;
              }
              .email-container { 
                max-width: 600px; 
                margin: 0 auto; 
                background-color: #ffffff;
              }
              .header { 
                background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); 
                color: white; 
                padding: 40px 30px; 
                text-align: center; 
              }
              .header h1 { 
                font-size: 28px; 
                margin-bottom: 10px;
                font-weight: 700;
              }
              .content { 
                padding: 40px 30px; 
              }
              .alert-box {
                background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
                border-left: 4px solid #dc2626;
                padding: 20px;
                margin: 25px 0;
                border-radius: 8px;
              }
              .info-box {
                background: #f9f9f9;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
              }
              .info-item {
                display: flex;
                justify-content: space-between;
                padding: 10px 0;
                border-bottom: 1px solid #e5e5e5;
              }
              .info-item:last-child {
                border-bottom: none;
              }
              .info-label {
                font-weight: 600;
                color: #666;
              }
              .info-value {
                color: #333;
              }
              .warning-box {
                background: #fff3cd;
                border-left: 4px solid #ffc107;
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
              }
              .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
                color: white;
                padding: 15px 40px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
                margin: 20px 0;
                text-align: center;
                box-shadow: 0 4px 6px rgba(220, 38, 38, 0.3);
              }
              .footer { 
                background: #2c3e50;
                color: #ecf0f1;
                padding: 30px;
                text-align: center;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <h1>🔐 Nueva Sesión Iniciada</h1>
                <p>Notificación de seguridad</p>
              </div>
              
              <div class="content">
                <p style="font-size: 16px; margin-bottom: 20px;">
                  Hola <strong>${userName}</strong>,
                </p>
                
                <div class="alert-box">
                  <p style="margin: 0; color: #991b1b; font-weight: 600;">
                    Se ha iniciado sesión en tu cuenta de ProntoClick
                  </p>
                </div>

                <p style="font-size: 16px; margin-bottom: 20px;">
                  Detectamos que se inició sesión en tu cuenta. Si fuiste tú, puedes ignorar este email de forma segura.
                </p>

                <div class="info-box">
                  <div class="info-item">
                    <span class="info-label">Fecha y hora:</span>
                    <span class="info-value">${formattedTime}</span>
                  </div>
                  ${ipAddress ? `
                  <div class="info-item">
                    <span class="info-label">Dirección IP:</span>
                    <span class="info-value">${ipAddress}</span>
                  </div>
                  ` : ''}
                  ${deviceInfo ? `
                  <div class="info-item">
                    <span class="info-label">Dispositivo:</span>
                    <span class="info-value">${deviceInfo}</span>
                  </div>
                  ` : ''}
                </div>

                <div class="warning-box">
                  <p style="margin: 0; color: #856404;">
                    <strong>⚠️ ¿No fuiste tú?</strong><br>
                    Si no iniciaste sesión, cambia tu contraseña inmediatamente y contacta a nuestro equipo de soporte.
                  </p>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                  <a href="${frontendUrl}/profile" class="cta-button">Ver Mi Cuenta</a>
                </div>

                <p style="font-size: 14px; color: #666; margin-top: 30px;">
                  Para mantener tu cuenta segura, te recomendamos:
                </p>
                <ul style="font-size: 14px; color: #666; padding-left: 20px; margin-top: 10px;">
                  <li style="margin-bottom: 8px;">Usar una contraseña única y segura</li>
                  <li style="margin-bottom: 8px;">Habilitar la autenticación de dos factores (2FA)</li>
                  <li style="margin-bottom: 8px;">No compartir tus credenciales con nadie</li>
                  <li>Revisar regularmente los inicios de sesión en tu cuenta</li>
                </ul>
              </div>

              <div class="footer">
                <p style="margin-bottom: 15px;">
                  <strong>ProntoClick</strong><br>
                  Tu comida favorita, a un click de distancia
                </p>
                <p style="margin-top: 20px; font-size: 12px; color: #95a5a6;">
                  Este es un email automático de seguridad. Si tienes dudas, contacta a nuestro soporte.<br>
                  © ${new Date().getFullYear()} ProntoClick. Todos los derechos reservados.
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      await sgMail.send(msg);
      this.logger.log(`Email de notificación de inicio de sesión enviado a ${userEmail}`);
      return true;
    } catch (error) {
      this.logger.error(`Error al enviar email de notificación de inicio de sesión a ${userEmail}:`, error);
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

