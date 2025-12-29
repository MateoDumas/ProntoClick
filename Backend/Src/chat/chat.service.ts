import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { OrdersService } from '../orders/orders.service';
import { ReportsService } from '../reports/reports.service';

interface ChatMessageDto {
  content: string;
  sessionId?: string;
}

interface UserContext {
  userId: string;
  userName: string;
  userEmail: string;
  recentOrders?: any[];
  reports?: any[];
  points?: number;
  favoriteRestaurants?: any[];
  addresses?: any[];
  pendingPenalty?: number;
}

interface SentimentAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative' | 'frustrated' | 'urgent';
  urgency: 'low' | 'medium' | 'high';
  confidence: number;
  keywords: string[];
}

interface IntentAnalysis {
  intent: string;
  entities: Record<string, any>;
  confidence: number;
  requiresAction: boolean;
}

@Injectable()
export class ChatService {
  private readonly openaiApiKey: string | undefined;
  private readonly useOpenAI: boolean;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private ordersService: OrdersService,
    private reportsService: ReportsService,
  ) {
    this.openaiApiKey = this.configService.get<string>('OPENAI_API_KEY');
    this.useOpenAI = !!this.openaiApiKey;
  }

  async createSession(userId: string) {
    const session = await this.prisma.chatSession.create({
      data: {
        userId,
        status: 'active',
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    // Mensaje de bienvenida inicial con opciones interactivas
    await this.prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        role: 'assistant',
        content: '¡Hola! 👋 Soy tu asistente virtual de ProntoClick. Estoy aquí para ayudarte con cualquier duda o problema que tengas.\n\n**¿En qué puedo ayudarte hoy?** Selecciona una opción:',
        metadata: {
          type: 'menu',
          options: [
            { id: 'pedidos', label: '📦 Hacer pedidos', category: 'main' },
            { id: 'estado', label: '📊 Estado de pedidos', category: 'main' },
            { id: 'problemas', label: '🐛 Reportar problemas', category: 'main' },
            { id: 'pagos', label: '💳 Métodos de pago', category: 'main' },
            { id: 'cupones', label: '🎟️ Cupones y promociones', category: 'main' },
            { id: 'puntos', label: '⭐ ProntoPuntos', category: 'main' },
            { id: 'otros', label: '🔧 Otros temas', category: 'main' },
          ],
        },
      },
    });

    return this.getSession(session.id, userId);
  }

  async getSession(sessionId: string, userId: string) {
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!session) {
      throw new NotFoundException('Sesión de chat no encontrada');
    }

    if (session.userId !== userId) {
      throw new BadRequestException('No tienes permiso para acceder a esta sesión');
    }

    return session;
  }

  async getUserSessions(userId: string) {
    return this.prisma.chatSession.findMany({
      where: { userId },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async sendMessage(userId: string, dto: ChatMessageDto) {
    let sessionId = dto.sessionId;

    // Si no hay sessionId, crear una nueva sesión
    if (!sessionId) {
      const newSession = await this.createSession(userId);
      sessionId = newSession.id;
    } else {
      // Verificar que la sesión pertenece al usuario
      const session = await this.prisma.chatSession.findUnique({
        where: { id: sessionId },
      });

      if (!session) {
        throw new NotFoundException('Sesión no encontrada');
      }

      if (session.userId !== userId) {
        throw new BadRequestException('No tienes permiso para acceder a esta sesión');
      }

      if (session.status === 'closed') {
        throw new BadRequestException('Esta sesión está cerrada');
      }
    }

    // Obtener historial reciente para detectar selecciones de menú
    const recentMessages = await this.prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    // Detectar si el usuario quiere conectar con soporte humano
    const wantsHumanSupport = this.detectHumanSupportRequest(dto.content);

    // Detectar si el usuario seleccionó una opción del menú
    const selectedOption = this.detectMenuSelection(dto.content, recentMessages);

    // Guardar mensaje del usuario
    const userMessage = await this.prisma.chatMessage.create({
      data: {
        sessionId,
        role: 'user',
        content: dto.content,
        metadata: selectedOption ? { selectedOption } : wantsHumanSupport ? { requestingHumanSupport: true } : null,
      },
    });

    // Obtener contexto del usuario
    const userContext = await this.getUserContext(userId);

    // Analizar sentimiento y urgencia del mensaje
    const sentiment = this.analyzeSentiment(dto.content);
    const intent = this.analyzeIntent(dto.content, userContext);

    // Obtener historial de mensajes
    const messages = await this.prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    });

    // Verificar si la sesión ya está conectada con soporte humano
    // Buscar el último mensaje del asistente para ver si ya se conectó con soporte
    const lastAssistantMessage = messages
      .filter((m) => m.role === 'assistant')
      .slice(-1)[0];
    
    const lastMetadata = lastAssistantMessage?.metadata as any;
    const isConnectedToHumanSupport =
      lastMetadata &&
      typeof lastMetadata === 'object' &&
      (lastMetadata.connectingToSupport === true ||
        lastMetadata.needsHumanSupport === true ||
        lastMetadata.fromSupport === true); // También verificar si hay mensajes del soporte humano

    // Verificar si hay algún mensaje previo del soporte humano
    const hasSupportMessages = messages.some((m) => {
      const msgMetadata = m.metadata as any;
      return (
        msgMetadata &&
        typeof msgMetadata === 'object' &&
        msgMetadata.fromSupport === true
      );
    });

    // Si ya está conectado con soporte humano O hay mensajes del soporte humano,
    // NO generar respuesta automática del chatbot
    // Solo guardar el mensaje del usuario y esperar respuesta del soporte humano
    if (isConnectedToHumanSupport || hasSupportMessages) {
      // Actualizar timestamp de la sesión
      await this.prisma.chatSession.update({
        where: { id: sessionId },
        data: { updatedAt: new Date() },
      });

      // Retornar solo el mensaje del usuario, sin respuesta del chatbot
      return {
        userMessage,
        assistantMessage: null, // No hay respuesta del chatbot
        sessionId,
      };
    }

    // Si el usuario quiere conectar con soporte humano, responder inmediatamente
    let assistantResponse;
    if (wantsHumanSupport) {
      // Marcar la sesión como que necesita soporte humano
      await this.prisma.chatSession.update({
        where: { id: sessionId },
        data: { updatedAt: new Date() },
      });

      assistantResponse = {
        content: `¡Perfecto! 🤝 Estoy conectándote con nuestro equipo de soporte humano ahora mismo.\n\n**✅ Conexión establecida**\n\nUn agente de soporte se conectará contigo en breve y aparecerá aquí mismo en el chat. Mientras tanto, puedes contarme más detalles sobre tu problema si quieres, así cuando el agente se conecte, ya tendrá toda la información necesaria para ayudarte de la mejor manera.\n\n⏳ **Conectando con soporte humano...**\n\n💡 **Tip:** No cierres esta ventana. El agente aparecerá aquí mismo y podrás hablar directamente con él. 😊`,
        metadata: {
          needsHumanSupport: true,
          connectingToSupport: true,
          canEscalate: true,
          timestamp: new Date().toISOString(),
        },
      };
    } else if (selectedOption) {
      assistantResponse = this.handleMenuSelection(selectedOption, userContext, messages);
    } else {
      // Verificar si el usuario está proporcionando detalles después de una selección previa
      const lastUserMessage = recentMessages.find((m) => m.role === 'user');
      const lastAssistantMessage = recentMessages.find((m) => m.role === 'assistant');
      
      // Si el último mensaje del asistente tenía una acción que requiere detalles
      const lastMetadata = lastAssistantMessage?.metadata as any;
      if (
        lastMetadata &&
        typeof lastMetadata === 'object' &&
        (lastMetadata.action === 'request_details' || lastMetadata.action === 'create_report')
      ) {
        // El usuario está proporcionando detalles, usar IA para generar respuesta contextual
        assistantResponse = await this.generateAIResponse(
          dto.content,
          messages,
          userContext,
          sentiment,
          intent,
        );
        
        // Si después de la respuesta el problema persiste, ofrecer escalación
        if (lastMetadata.canEscalate) {
          // Agregar opción de escalar si el problema no se resuelve
          assistantResponse.metadata = {
            ...(assistantResponse.metadata || {}),
            canEscalate: true,
            escalationPrompt: 'Si esto no resuelve tu problema, puedo conectarte con soporte humano.',
          };
        }
      } else {
        // Generar respuesta normal con IA (con análisis de sentimiento e intención)
        assistantResponse = await this.generateAIResponse(
          dto.content,
          messages,
          userContext,
          sentiment,
          intent,
        );
        
        // Si el sentimiento es frustrado o urgente, priorizar escalación
        if (sentiment.sentiment === 'frustrated' || sentiment.sentiment === 'urgent' || sentiment.urgency === 'high') {
          assistantResponse.metadata = {
            ...(assistantResponse.metadata || {}),
            canEscalate: true,
            sentiment: sentiment.sentiment,
            urgency: sentiment.urgency,
          };
        }
        
        // Si requiere acción inmediata, agregar sugerencias proactivas
        if (intent.requiresAction) {
          assistantResponse.metadata = {
            ...(assistantResponse.metadata || {}),
            requiresAction: true,
            intent: intent.intent,
            entities: intent.entities,
          };
        }
      }
    }

    // Guardar respuesta del asistente
    const assistantMessage = await this.prisma.chatMessage.create({
      data: {
        sessionId,
        role: 'assistant',
        content: assistantResponse.content,
        metadata: assistantResponse.metadata || null,
      },
    });

    // Actualizar timestamp de la sesión
    await this.prisma.chatSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() },
    });

    return {
      userMessage,
      assistantMessage,
      sessionId,
    };
  }

  private detectHumanSupportRequest(content: string): boolean {
    const lowerContent = content.toLowerCase().trim();
    
    const supportKeywords = [
      'soporte humano',
      'hablar con alguien',
      'conectar con soporte',
      'quiero conectar con soporte',
      'conectame con soporte',
      'conectarme con soporte',
      'agente humano',
      'persona real',
      'quiero hablar con',
      'necesito hablar con',
      'conectame con',
      'conectarme con',
      'hablar con un humano',
      'hablar con una persona',
      'quiero hablar con soporte',
      'necesito soporte humano',
    ];

    return supportKeywords.some(keyword => lowerContent.includes(keyword));
  }

  private detectMenuSelection(content: string, recentMessages: any[]): string | null {
    const lowerContent = content.toLowerCase().trim();
    
    // Buscar el último mensaje del asistente con opciones
    const lastAssistantMessage = recentMessages
      .filter((m) => m.role === 'assistant')
      .find((m) => {
        const metadata = m.metadata as any;
        return metadata && typeof metadata === 'object' && metadata.type === 'menu';
      });

    if (!lastAssistantMessage) {
      return null;
    }

    const metadata = lastAssistantMessage.metadata as any;
    if (!metadata || typeof metadata !== 'object' || !metadata.options || !Array.isArray(metadata.options)) {
      return null;
    }

    // Verificar si el contenido del usuario coincide con alguna opción
    const options = metadata.options;
    for (const option of options) {
      const optionText = option.label.toLowerCase();
      const optionId = option.id.toLowerCase();
      
      // Extraer palabras clave del label (sin emojis ni números)
      const optionKeywords = optionText
        .replace(/[📦📊🐛💳🎟️⭐🔧📍❤️👤❌🚫📅✅👀⏰🚚❓💰🎁👨‍🍳🚗🎉]/g, '')
        .trim()
        .split(/\s+/)
        .filter((w: string) => w.length > 2);
      
      // Verificar coincidencias más flexibles
      if (
        // Coincidencia exacta con ID
        lowerContent === optionId ||
        // El contenido contiene el ID
        lowerContent.includes(optionId) ||
        // El label completo coincide
        lowerContent === optionText ||
        // El contenido contiene el label completo
        lowerContent.includes(optionText) ||
        // El label contiene el contenido (para cuando el usuario escribe parte del label)
        optionText.includes(lowerContent) ||
        // Coincidencia con palabras clave principales
        optionKeywords.some((keyword: string) => lowerContent.includes(keyword) && keyword.length > 3)
      ) {
        return option.id;
      }
    }

    return null;
  }

  private handleMenuSelection(
    selectedOption: string,
    userContext: UserContext,
    messageHistory: any[],
  ): { content: string; metadata?: any } {
    // Menú principal
    if (selectedOption === 'pedidos') {
      return {
        content: `Perfecto, te ayudo con pedidos. 📦\n\n**¿Qué necesitas sobre pedidos?** Selecciona una opción:`,
        metadata: {
          type: 'menu',
          options: [
            { id: 'pedidos-como', label: '📝 Cómo hacer un pedido', category: 'pedidos' },
            { id: 'pedidos-problema', label: '❌ Problema al hacer pedido', category: 'pedidos' },
            { id: 'pedidos-programar', label: '📅 Programar un pedido', category: 'pedidos' },
            { id: 'pedidos-cancelar', label: '🚫 Cancelar un pedido', category: 'pedidos' },
          ],
        },
      };
    }

    if (selectedOption === 'estado') {
      const ordersInfo = userContext.recentOrders?.length > 0
        ? `\n\n**Tus pedidos recientes:**\n${userContext.recentOrders.slice(0, 3).map((o: any) => 
            `• ${o.id.substring(0, 8)}... - ${o.status}`
          ).join('\n')}`
        : '';

      return {
        content: `Te ayudo con el estado de tus pedidos. 📊${ordersInfo}\n\n**¿Qué necesitas?** Selecciona una opción:`,
        metadata: {
          type: 'menu',
          options: [
            { id: 'estado-ver', label: '👀 Ver estado de mis pedidos', category: 'estado' },
            { id: 'estado-tardando', label: '⏰ Mi pedido está tardando', category: 'estado' },
            { id: 'estado-no-llega', label: '🚚 Mi pedido no ha llegado', category: 'estado' },
            { id: 'estado-significado', label: '❓ ¿Qué significa cada estado?', category: 'estado' },
          ],
        },
      };
    }

    if (selectedOption === 'problemas') {
      return {
        content: `Entiendo que tienes un problema. 🐛 Estoy aquí para ayudarte.\n\n**¿Qué tipo de problema tienes?** Selecciona una opción:`,
        metadata: {
          type: 'menu',
          options: [
            { id: 'problemas-producto', label: '🍔 Producto incorrecto o faltante', category: 'problemas' },
            { id: 'problemas-pedido', label: '📦 Pedido que no llegó', category: 'problemas' },
            { id: 'problemas-pago', label: '💳 Problema con el pago', category: 'problemas' },
            { id: 'problemas-reembolso', label: '💰 Solicitar reembolso', category: 'problemas' },
            { id: 'problemas-otro', label: '🔧 Otro problema', category: 'problemas' },
          ],
        },
      };
    }

    if (selectedOption === 'pagos') {
      return {
        content: `Te ayudo con métodos de pago. 💳\n\n**¿Qué necesitas saber?** Selecciona una opción:`,
        metadata: {
          type: 'menu',
          options: [
            { id: 'pagos-tarjeta', label: '💳 Pagar con tarjeta', category: 'pagos' },
            { id: 'pagos-efectivo', label: '💵 Pagar en efectivo', category: 'pagos' },
            { id: 'pagos-problema', label: '❌ Problema al pagar', category: 'pagos' },
            { id: 'pagos-seguridad', label: '🔒 Seguridad de pagos', category: 'pagos' },
          ],
        },
      };
    }

    if (selectedOption === 'cupones') {
      return {
        content: `Te ayudo con cupones y promociones. 🎟️\n\n**¿Qué necesitas?** Selecciona una opción:`,
        metadata: {
          type: 'menu',
          options: [
            { id: 'cupones-usar', label: '✅ Cómo usar un cupón', category: 'cupones' },
            { id: 'cupones-problema', label: '❌ Mi cupón no funciona', category: 'cupones' },
            { id: 'cupones-obtener', label: '🎁 Cómo obtener cupones', category: 'cupones' },
          ],
        },
      };
    }

    if (selectedOption === 'puntos') {
      return {
        content: `Te ayudo con ProntoPuntos. ⭐\n\n**¿Qué necesitas?** Selecciona una opción:`,
        metadata: {
          type: 'menu',
          options: [
            { id: 'puntos-ganar', label: '💰 Cómo ganar puntos', category: 'puntos' },
            { id: 'puntos-canjear', label: '🎁 Canjear recompensas', category: 'puntos' },
            { id: 'puntos-ver', label: '👀 Ver mis puntos', category: 'puntos' },
          ],
        },
      };
    }

    if (selectedOption === 'otros') {
      return {
        content: `Te ayudo con otros temas. 🔧\n\n**¿Qué necesitas?** Selecciona una opción:`,
        metadata: {
          type: 'menu',
          options: [
            { id: 'otros-direcciones', label: '📍 Gestionar direcciones', category: 'otros' },
            { id: 'otros-favoritos', label: '❤️ Favoritos', category: 'otros' },
            { id: 'otros-cuenta', label: '👤 Mi cuenta', category: 'otros' },
            { id: 'otros-tecnico', label: '🔧 Problema técnico', category: 'otros' },
          ],
        },
      };
    }

    // Sub-opciones de PEDIDOS
    if (selectedOption === 'pedidos-como') {
      return {
        content: `¡Perfecto! Te explico paso a paso cómo hacer un pedido: 📦\n\n**Paso 1: Explora restaurantes** 🍕\n   • Ve a la página principal\n   • Navega por los restaurantes disponibles\n   • Puedes usar filtros o buscar por nombre\n\n**Paso 2: Selecciona productos** 🛒\n   • Entra al restaurante que te guste\n   • Agrega productos al carrito\n   • Puedes ajustar las cantidades\n\n**Paso 3: Ve al checkout** 💳\n   • Haz clic en el carrito (esquina inferior derecha)\n   • Revisa tu pedido\n   • Completa tu dirección de entrega\n\n**Paso 4: Método de pago** 💰\n   • Elige entre efectivo o tarjeta\n   • Si usas tarjeta, completa los datos\n   • Puedes aplicar un cupón si tienes uno\n\n**Paso 5: Confirma** ✅\n   • Revisa todo una última vez\n   • Confirma tu pedido\n   • ¡Listo! Recibirás una confirmación\n\n¿En qué paso específico necesitas más ayuda? O si tienes algún problema, cuéntame y te ayudo a resolverlo. 😊`,
      };
    }

    if (selectedOption === 'pedidos-problema') {
      return {
        content: `Entiendo que tienes un problema al hacer tu pedido. 😔 Déjame ayudarte a identificar qué está pasando:\n\n**Problemas comunes al hacer pedidos:**\n\n1️⃣ **No puedo agregar productos al carrito**\n   → Verifica que estés logueado\n   → Recarga la página\n   → Limpia la caché del navegador\n\n2️⃣ **No puedo completar el checkout**\n   → Verifica que tengas una dirección guardada\n   → Asegúrate de tener método de pago configurado\n   → Revisa que el pedido mínimo se cumpla\n\n3️⃣ **El pago no se procesa**\n   → Verifica que tu tarjeta tenga fondos\n   → Revisa que los datos de la tarjeta sean correctos\n   → Intenta con otro método de pago\n\n4️⃣ **Error al confirmar el pedido**\n   → Verifica tu conexión a internet\n   → Intenta nuevamente en unos minutos\n   → Revisa que todos los campos estén completos\n\n¿Cuál de estos problemas estás experimentando? O si es algo diferente, cuéntame más detalles y te ayudo. Si después de intentar estas soluciones el problema persiste, puedo conectarte con nuestro equipo de soporte humano. 🤗`,
        metadata: {
          type: 'action',
          action: 'request_details',
        },
      };
    }

    if (selectedOption === 'pedidos-programar') {
      return {
        content: `¡Sí! Puedes programar pedidos para el futuro. 📅\n\n**Pedidos programados:**\n\n✅ **Cómo programar un pedido:**\n1. Agrega productos al carrito normalmente\n2. En el checkout, activa la opción "Programar pedido"\n3. Selecciona la fecha y hora deseada\n4. Completa el resto del proceso normalmente\n\n⏰ **Límites:**\n• Puedes programar hasta 30 días en el futuro\n• La hora debe ser en el futuro (no puedes programar para el pasado)\n• El pedido se procesará automáticamente en la fecha/hora seleccionada\n\n💡 **Ventajas:**\n• Planifica tus comidas con anticipación\n• Asegura tu pedido aunque el restaurante esté cerrado\n• Perfecto para eventos o reuniones\n\n**Ver pedidos programados:**\n• Ve a "Mis Pedidos" en tu perfil\n• Los pedidos programados aparecen con el estado "Programado"\n• Puedes cancelarlos antes de la fecha programada\n\n¿Quieres programar un pedido ahora o necesitas ayuda con algo específico sobre pedidos programados? 😊`,
      };
    }

    if (selectedOption === 'pedidos-cancelar') {
      return {
        content: `Te explico cómo cancelar un pedido y qué implica: ❌\n\n**Cómo cancelar un pedido:**\n1. Ve a "Mis Pedidos" en tu perfil\n2. Selecciona el pedido que quieres cancelar\n3. Haz clic en "Cancelar pedido"\n4. Indica la razón de la cancelación\n5. Confirma la cancelación\n\n**Cuándo puedes cancelar:**\n✅ Pedidos pendientes o confirmados: Sin costo\n✅ Pedidos en preparación: Sin costo\n⚠️ Pedidos en camino: Se aplica un cargo del 20% del total\n❌ Pedidos entregados: No se pueden cancelar\n\n**Penalización por cancelaciones:**\n• Si cancelas un pedido en camino, hay un cargo del 20%\n• Si cancelas varios pedidos, se aplica una penalización del 5% en tu próximo pedido\n• Esta penalización se suma al total de tu siguiente compra\n\n**Reembolsos:**\n• Si cancelas a tiempo, recibirás reembolso completo\n• Si cancelas en camino, se descontará el 20%\n• Los reembolsos tardan 3-5 días hábiles\n\n¿Necesitas cancelar un pedido específico? Cuéntame el estado del pedido y te ayudo con el proceso. 😊`,
      };
    }

    // Sub-opciones de ESTADO
    if (selectedOption === 'estado-ver') {
      const ordersInfo = userContext.recentOrders?.length > 0
        ? `\n\n**Tus pedidos recientes:** 📋\n${userContext.recentOrders.slice(0, 5).map((order: any) => {
            const statusEmoji = {
              pending: '⏳',
              confirmed: '✅',
              preparing: '👨‍🍳',
              ready: '📦',
              on_the_way: '🚗',
              delivered: '🎉',
              cancelled: '❌',
              scheduled: '📅',
            }[order.status] || '📋';
            
            const statusText = {
              pending: 'Pendiente de confirmación',
              confirmed: 'Confirmado',
              preparing: 'En preparación',
              ready: 'Listo para entrega',
              on_the_way: 'En camino',
              delivered: 'Entregado',
              cancelled: 'Cancelado',
              scheduled: 'Programado',
            }[order.status] || order.status;

            return `   ${statusEmoji} Pedido ${order.id.substring(0, 8)}... - ${statusText} - $${order.total}`;
          }).join('\n')}`
        : '\n\nNo tienes pedidos recientes.';

      return {
        content: `Para ver el estado de tus pedidos: 📊\n\n1. Ve a tu perfil (haz clic en tu nombre/avatar)\n2. Selecciona "Mis Pedidos"\n3. Ahí verás todos tus pedidos con su estado actual\n4. Haz clic en cualquier pedido para ver más detalles${ordersInfo}\n\n¿Necesitas ayuda con algún pedido específico? 😊`,
      };
    }

    if (selectedOption === 'estado-tardando' || selectedOption === 'estado-no-llega') {
      const pendingOrders = userContext.recentOrders?.filter(
        (o: any) => ['pending', 'confirmed', 'preparing', 'ready', 'on_the_way'].includes(o.status)
      ) || [];

      if (pendingOrders.length > 0) {
        return {
          content: `Entiendo tu preocupación. 😟 Veo que tienes ${pendingOrders.length} pedido(s) en proceso. Déjame ayudarte:\n\n**¿Qué puedes hacer si tu pedido está tardando?**\n\n1️⃣ **Verifica el estado actual**\n   • Ve a "Mis Pedidos" en tu perfil\n   • Revisa el estado del pedido\n   • Los tiempos normales son 30-45 minutos\n\n2️⃣ **Si está en "preparando" o "listo"**\n   • El restaurante está trabajando en tu pedido\n   • Esto es normal, ten paciencia 😊\n   • Si pasa más de 1 hora, puedes crear un reporte\n\n3️⃣ **Si está "en camino"**\n   • Tu pedido ya salió del restaurante\n   • Debería llegar pronto\n   • Puedes seguir el rastreo en tiempo real\n\n4️⃣ **Si lleva más de 1 hora**\n   • Puedes crear un reporte desde "Mis Pedidos"\n   • Selecciona el pedido y "Reportar problema"\n   • Nuestro equipo revisará tu caso\n\n¿Quieres que te ayude a crear un reporte ahora? O si el problema es urgente, puedo conectarte con soporte humano. 🤝`,
          metadata: {
            type: 'action',
            action: 'create_report',
            canEscalate: true,
          },
        };
      }

      return {
        content: `Entiendo tu preocupación. 😟\n\n**¿Qué puedes hacer si tu pedido está tardando?**\n\n1️⃣ **Verifica el estado**\n   • Ve a "Mis Pedidos" en tu perfil\n   • Los tiempos normales son 30-45 minutos\n\n2️⃣ **Si lleva más de 1 hora**\n   • Crea un reporte desde "Mis Pedidos"\n   • Selecciona el pedido → "Reportar problema"\n\n3️⃣ **Si es urgente**\n   • Puedo conectarte con soporte humano\n   • Ellos pueden contactar al restaurante directamente\n\n¿Quieres que te ayude a crear un reporte o prefieres hablar con soporte humano? 🤝`,
        metadata: {
          type: 'action',
          action: 'create_report',
          canEscalate: true,
        },
      };
    }

    if (selectedOption === 'estado-significado') {
      return {
        content: `Te explico qué significa cada estado de pedido: 📊\n\n⏳ **Pendiente** - Tu pedido está esperando confirmación del restaurante\n✅ **Confirmado** - El restaurante aceptó tu pedido y lo está preparando\n👨‍🍳 **En preparación** - Tu comida se está cocinando\n📦 **Listo** - Tu pedido está listo y saldrá en camino\n🚗 **En camino** - El repartidor está llevando tu pedido\n🎉 **Entregado** - ¡Tu pedido llegó! Disfrútalo\n❌ **Cancelado** - El pedido fue cancelado\n📅 **Programado** - Pedido programado para el futuro\n\n**Tiempos típicos:**\n• Pendiente/Confirmado: 0-5 minutos\n• En preparación: 15-25 minutos\n• Listo: 5-10 minutos\n• En camino: 10-20 minutos\n• Total: 30-45 minutos promedio\n\n¿Tienes algún pedido en un estado específico que te preocupa? 😊`,
      };
    }

    // Sub-opciones de PROBLEMAS
    if (selectedOption === 'problemas-producto') {
      return {
        content: `Lamento mucho que hayas recibido un producto incorrecto o que falte algo. 😔 Te ayudo a resolverlo:\n\n**Pasos para reportar un problema con tu pedido:**\n\n1️⃣ **Ve a "Mis Pedidos"**\n   • Encuentra el pedido con el problema\n   • Haz clic en "Ver detalles"\n\n2️⃣ **Crea un reporte**\n   • Busca el botón "Reportar problema"\n   • Selecciona el tipo: "Producto incorrecto" o "Producto faltante"\n\n3️⃣ **Describe el problema**\n   • Sé específico sobre qué salió mal\n   • Menciona qué productos están afectados\n   • Agrega cualquier detalle relevante\n\n4️⃣ **Envía el reporte**\n   • Nuestro equipo lo revisará en 24-48 horas\n   • Te contactaremos con una solución\n   • Podemos ofrecer reembolso o reposición\n\n**¿Quieres que te ayude a crear el reporte ahora?** O si el problema es urgente, puedo conectarte directamente con soporte humano para acelerar el proceso. 🤝`,
        metadata: {
          type: 'action',
          action: 'create_report',
          reportType: 'product_issue',
          canEscalate: true,
        },
      };
    }

    if (selectedOption === 'problemas-pedido') {
      return {
        content: `Lamento que tu pedido no haya llegado. 😔 Esto es importante y lo resolveremos.\n\n**Pasos para reportar:**\n\n1️⃣ **Verifica el estado**\n   • Ve a "Mis Pedidos"\n   • Revisa si el pedido aparece como "Entregado"\n\n2️⃣ **Si no aparece como entregado pero no llegó:**\n   • Crea un reporte desde "Mis Pedidos"\n   • Selecciona "Pedido no llegó"\n   • Describe la situación\n\n3️⃣ **Si aparece como entregado pero no lo recibiste:**\n   • Esto es más urgente\n   • Crea el reporte inmediatamente\n   • O puedo conectarte con soporte humano ahora\n\n**Nuestro equipo:**\n• Revisará tu caso en 24 horas\n• Contactará al restaurante y repartidor\n• Te ofrecerá una solución (reembolso o nuevo pedido)\n\n**¿Qué prefieres?**\n• Te guío para crear el reporte\n• Te conecto con soporte humano ahora (más rápido)\n\n¿Cuál opción prefieres? 🤝`,
        metadata: {
          type: 'action',
          action: 'create_report',
          reportType: 'order_not_delivered',
          canEscalate: true,
        },
      };
    }

    if (selectedOption === 'problemas-pago') {
      return {
        content: `Te ayudo a resolver el problema con el pago. 💳\n\n**Problemas comunes y soluciones:**\n\n1️⃣ **El pago no se procesa**\n   → Verifica que tu tarjeta tenga fondos suficientes\n   → Revisa que los datos sean correctos (número, CVV, fecha)\n   → Intenta con otra tarjeta\n   → Verifica que tu banco no haya bloqueado la transacción\n\n2️⃣ **Error al confirmar el pago**\n   → Verifica tu conexión a internet\n   → Intenta nuevamente en unos minutos\n   → Limpia la caché del navegador\n\n3️⃣ **Se cobró dos veces**\n   → Esto es raro, pero puede pasar\n   → Crea un reporte inmediatamente\n   → O puedo conectarte con soporte humano ahora\n\n4️⃣ **No puedo cambiar el método de pago**\n   → En el checkout, deberías poder cambiar entre tarjeta y efectivo\n   → Si no puedes, recarga la página\n\n**Si el problema persiste:**\nPuedo conectarte con soporte humano para que revisen tu caso específico y te ayuden a resolverlo. ¿Quieres que te conecte ahora? 🤝`,
        metadata: {
          type: 'action',
          action: 'request_details',
          canEscalate: true,
        },
      };
    }

    if (selectedOption === 'problemas-reembolso') {
      return {
        content: `Te explico cómo solicitar un reembolso: 💰\n\n**Para solicitar un reembolso:**\n\n1️⃣ **Crea un reporte del problema**\n   • Ve a "Mis Pedidos"\n   • Selecciona el pedido afectado\n   • Crea un reporte explicando el problema\n\n2️⃣ **Menciona que quieres reembolso**\n   • En la descripción del reporte\n   • Indica que deseas un reembolso\n   • Explica por qué (producto incorrecto, no llegó, etc.)\n\n3️⃣ **Revisión del equipo**\n   • Nuestro equipo revisará tu caso\n   • Si es válido, procesaremos el reembolso\n   • Te notificaremos cuando esté listo\n\n**Tiempos de reembolso:**\n• Revisión: 24-48 horas\n• Procesamiento: 3-5 días hábiles\n• El dinero volverá a tu método de pago original\n\n**¿Quieres que te ayude a crear el reporte ahora?** O si prefieres, puedo conectarte directamente con soporte humano para acelerar el proceso. 🤝`,
        metadata: {
          type: 'action',
          action: 'create_report',
          reportType: 'refund',
          canEscalate: true,
        },
      };
    }

    if (selectedOption === 'problemas-otro') {
      return {
        content: `Entiendo que tienes otro tipo de problema. 😔\n\n**Para ayudarte mejor, cuéntame:**\n\n• ¿Qué problema específico estás experimentando?\n• ¿En qué parte de la aplicación ocurre?\n• ¿Cuándo empezó el problema?\n\n**Mientras tanto, puedo:**\n✅ Ayudarte a crear un reporte detallado\n✅ Conectarte con soporte humano para atención inmediata\n✅ Darte información sobre cómo contactarnos\n\n**¿Qué prefieres?**\n• Contarme más detalles del problema y te ayudo paso a paso\n• Que te conecte con soporte humano ahora\n\n¿Cuál opción prefieres? 🤝`,
        metadata: {
          type: 'action',
          action: 'request_details',
          canEscalate: true,
        },
      };
    }

    // Sub-opciones de PAGOS
    if (selectedOption === 'pagos-tarjeta') {
      return {
        content: `¡Sí! Puedes pagar con tarjeta de débito o crédito. 💳\n\n**Métodos de pago disponibles:**\n\n💳 **Tarjeta de Crédito o Débito**\n   • Aceptamos todas las tarjetas principales (Visa, Mastercard, Amex)\n   • El pago se procesa de forma segura con Stripe\n   • Solo necesitas ingresar los datos de tu tarjeta una vez\n   • El pago se cobra cuando confirmas el pedido\n\n**Cómo pagar con tarjeta:**\n1. En el checkout, selecciona "Tarjeta" como método de pago\n2. Ingresa los datos de tu tarjeta:\n   • Número de tarjeta\n   • Fecha de vencimiento\n   • CVV (código de seguridad)\n   • Nombre del titular\n3. Confirma tu pedido\n4. El pago se procesará automáticamente\n\n**Seguridad:**\n✅ Tus datos de tarjeta están protegidos\n✅ No guardamos los números completos de tu tarjeta\n✅ Usamos encriptación de nivel bancario (Stripe)\n✅ Cumplimos con estándares PCI-DSS\n\n¿Tienes algún problema al pagar con tarjeta o necesitas ayuda con otro método de pago? 😊`,
      };
    }

    if (selectedOption === 'pagos-efectivo') {
      return {
        content: `¡Sí! Puedes pagar en efectivo. 💵\n\n**Pago en efectivo:**\n• Selecciona "Efectivo" como método de pago en el checkout\n• El repartidor traerá el cambio exacto\n• Asegúrate de tener el dinero listo cuando llegue tu pedido\n• El pago se realiza al momento de la entrega\n\n**Ventajas del pago en efectivo:**\n✅ No necesitas tarjeta\n✅ Pagas solo cuando recibes tu pedido\n✅ El repartidor trae cambio\n✅ Ideal si prefieres no usar tarjeta\n\n**Importante:**\n• Ten el dinero exacto o cerca del total\n• El repartidor traerá cambio, pero es mejor tenerlo listo\n• El pedido se procesa igual, solo pagas al recibirlo\n\n¿Necesitas ayuda con algo más sobre el pago? 😊`,
      };
    }

    if (selectedOption === 'pagos-problema') {
      return {
        content: `Te ayudo a resolver el problema con el pago. 💳\n\n**Problemas comunes y soluciones:**\n\n1️⃣ **El pago no se procesa**\n   → Verifica que tu tarjeta tenga fondos suficientes\n   → Revisa que los datos sean correctos (número, CVV, fecha)\n   → Intenta con otra tarjeta\n   → Verifica que tu banco no haya bloqueado la transacción\n\n2️⃣ **Error al confirmar el pago**\n   → Verifica tu conexión a internet\n   → Intenta nuevamente en unos minutos\n   → Limpia la caché del navegador\n   → Prueba en otro navegador\n\n3️⃣ **Se cobró dos veces**\n   → Esto es raro, pero puede pasar\n   → Crea un reporte inmediatamente\n   → O puedo conectarte con soporte humano ahora\n\n4️⃣ **No puedo cambiar el método de pago**\n   → En el checkout, deberías poder cambiar entre tarjeta y efectivo\n   → Si no puedes, recarga la página\n   → Intenta cerrar y abrir el checkout de nuevo\n\n**Si el problema persiste:**\nPuedo conectarte con soporte humano para que revisen tu caso específico y te ayuden a resolverlo. ¿Quieres que te conecte ahora? 🤝`,
        metadata: {
          type: 'action',
          action: 'request_details',
          canEscalate: true,
        },
      };
    }

    if (selectedOption === 'pagos-seguridad') {
      return {
        content: `Tu seguridad es muy importante para nosotros. 🔒\n\n**Seguridad de pagos en ProntoClick:**\n\n✅ **Encriptación de nivel bancario**\n   • Usamos Stripe, líder mundial en pagos seguros\n   • Todos los datos se transmiten encriptados (SSL/TLS)\n   • Cumplimos con estándares PCI-DSS\n\n✅ **Protección de datos**\n   • No guardamos los números completos de tu tarjeta\n   • Solo guardamos los últimos 4 dígitos para referencia\n   • Los datos sensibles se procesan directamente con Stripe\n\n✅ **Verificación de identidad**\n   • Algunas transacciones pueden requerir verificación adicional\n   • Esto es normal y protege tu cuenta\n\n✅ **Monitoreo de fraudes**\n   • Stripe monitorea todas las transacciones\n   • Detecta actividad sospechosa automáticamente\n   • Protege tanto a ti como a nosotros\n\n**Consejos de seguridad:**\n• Nunca compartas los datos de tu tarjeta con nadie\n• Verifica que estés en el sitio oficial de ProntoClick\n• Revisa tus estados de cuenta regularmente\n\n¿Tienes alguna preocupación específica sobre seguridad? 😊`,
      };
    }

    // Sub-opciones de CUPONES
    if (selectedOption === 'cupones-usar') {
      return {
        content: `Te explico cómo usar un cupón paso a paso: 🎟️\n\n**Cómo aplicar un cupón:**\n\n1️⃣ **Obtén el código del cupón**\n   • Puede venir por email\n   • O estar en promociones activas\n   • O ser parte de una recompensa de ProntoPuntos\n\n2️⃣ **Agrega productos al carrito**\n   • Asegúrate de cumplir el pedido mínimo si el cupón lo requiere\n   • Verifica que el cupón aplique al restaurante (algunos son específicos)\n\n3️⃣ **Ve al checkout**\n   • Busca el campo "Código de cupón" o "Aplicar cupón"\n   • Ingresa el código exactamente como aparece\n   • Haz clic en "Aplicar" o "Usar cupón"\n\n4️⃣ **Verifica el descuento**\n   • Deberías ver el descuento aplicado en el resumen\n   • Revisa el total final con el descuento\n   • Si no aparece, verifica que el código sea correcto\n\n5️⃣ **Confirma tu pedido**\n   • El descuento se aplicará automáticamente\n   • El total final incluirá el descuento\n\n**Consejos:**\n• Los cupones se aplican antes de confirmar\n• Algunos tienen fecha de vencimiento\n• Verifica los términos y condiciones\n• Algunos cupones son de un solo uso\n\n¿Tienes un código específico que quieres usar o tienes algún problema al aplicarlo? 😊`,
      };
    }

    if (selectedOption === 'cupones-problema') {
      return {
        content: `Entiendo que tienes problemas con un cupón. 😔 Déjame ayudarte a identificar el problema:\n\n**Razones comunes por las que un cupón no funciona:**\n\n1️⃣ **Código incorrecto**\n   → Verifica que escribiste el código correctamente\n   → Revisa mayúsculas y minúsculas (algunos son sensibles)\n   → Asegúrate de no tener espacios extra\n   → Verifica que no haya caracteres faltantes\n\n2️⃣ **Cupón expirado**\n   → Los cupones tienen fecha de vencimiento\n   → Verifica que aún esté vigente\n   → Algunos cupones son de tiempo limitado\n\n3️⃣ **No cumples los requisitos**\n   → Algunos cupones requieren pedido mínimo\n   → Verifica que tu pedido cumpla el monto requerido\n   → Algunos cupones son solo para ciertos restaurantes\n   → Revisa los términos y condiciones del cupón\n\n4️⃣ **Ya lo usaste**\n   → Algunos cupones son de un solo uso\n   → Revisa si ya lo aplicaste antes\n   → Algunos tienen límite de usos por usuario\n\n5️⃣ **Cupón no aplica a tu pedido**\n   → Algunos cupones son solo para ciertos productos\n   → Verifica que el cupón aplique a tu restaurante\n   → Algunos no aplican a pedidos programados\n\n**Si después de verificar todo esto el cupón sigue sin funcionar:**\nPuedo conectarte con soporte humano para que revisen tu caso específico. ¿Quieres que te conecte? 🤝`,
        metadata: {
          type: 'action',
          action: 'request_details',
          canEscalate: true,
        },
      };
    }

    if (selectedOption === 'cupones-obtener') {
      return {
        content: `Te explico cómo obtener cupones: 🎁\n\n**Formas de obtener cupones:**\n\n1️⃣ **Por email** 📧\n   • Suscríbete a nuestras promociones\n   • Recibirás cupones exclusivos por email\n   • Revisa tu bandeja de entrada y spam\n\n2️⃣ **Promociones activas** 🎉\n   • Ve a la sección de promociones en la app\n   • Algunas promociones incluyen cupones\n   • Revisa regularmente para nuevas ofertas\n\n3️⃣ **ProntoPuntos** ⭐\n   • Canjea puntos por cupones\n   • Ve a tu perfil → ProntoPuntos → Recompensas\n   • Algunas recompensas son cupones de descuento\n\n4️⃣ **Referidos** 👥\n   • Invita amigos a ProntoClick\n   • Tanto tú como tu amigo pueden recibir cupones\n   • Revisa la sección de referidos en tu perfil\n\n5️⃣ **Eventos especiales** 🎊\n   • Seguimos nuestras redes sociales\n   • Participa en eventos y sorteos\n   • A veces damos cupones especiales\n\n**Consejos:**\n• Revisa tu email regularmente\n• Canjea puntos por cupones cuando puedas\n• Invita amigos para obtener más cupones\n\n¿Quieres saber más sobre alguna de estas formas de obtener cupones? 😊`,
      };
    }

    // Sub-opciones de PUNTOS
    if (selectedOption === 'puntos-ganar') {
      return {
        content: `Te explico cómo ganar ProntoPuntos: 💰\n\n**Formas de ganar puntos:**\n\n💰 **Con cada compra**\n   • Ganas puntos según el monto de tu pedido\n   • Los puntos se calculan automáticamente\n   • Se acreditan cuando se confirma tu pedido\n   • Los puntos se suman a tu cuenta\n\n**Ejemplo:**\n• Si tu pedido es de $20, ganas puntos equivalentes\n• Los puntos se acumulan con cada compra\n• Cuanto más compres, más puntos ganas\n\n**Ver tus puntos:**\n• Ve a tu perfil\n• Busca la sección "ProntoPuntos"\n• Ahí verás cuántos puntos tienes\n• También verás el historial de puntos ganados\n\n**Consejos:**\n• Haz pedidos regularmente para acumular más puntos\n• Los puntos no expiran\n• Acumula puntos para canjear mejores recompensas\n\n¿Quieres saber cómo canjear tus puntos por recompensas? 😊`,
      };
    }

    if (selectedOption === 'puntos-canjear') {
      return {
        content: `Te explico cómo canjear tus ProntoPuntos por recompensas: 🎁\n\n**Cómo canjear puntos:**\n\n1️⃣ **Ve a tu perfil**\n   • Haz clic en tu nombre/avatar\n   • Busca la sección "ProntoPuntos"\n\n2️⃣ **Explora recompensas**\n   • Ve a "Recompensas disponibles"\n   • Cada recompensa muestra cuántos puntos cuesta\n   • Lee la descripción de cada una\n\n3️⃣ **Selecciona una recompensa**\n   • Verifica que tengas suficientes puntos\n   • Haz clic en "Canjear"\n   • Confirma el canje\n\n4️⃣ **Recibe tu recompensa**\n   • Si es un cupón, recibirás el código\n   • Si es un descuento, se aplicará automáticamente\n   • Si es un producto gratis, se agregará a tu próximo pedido\n\n**Tipos de recompensas:**\n🎟️ Cupones de descuento\n🎁 Productos gratis\n🚚 Envío gratis\n💰 Descuentos especiales\n\n**Consejos:**\n• Acumula puntos para mejores recompensas\n• Revisa las recompensas disponibles regularmente\n• Los puntos no expiran, tómate tu tiempo\n\n¿Quieres ver qué recompensas tienes disponibles? 😊`,
      };
    }

    if (selectedOption === 'puntos-ver') {
      return {
        content: `Para ver tus ProntoPuntos: 👀\n\n**Cómo ver tus puntos:**\n\n1️⃣ **Ve a tu perfil**\n   • Haz clic en tu nombre o avatar (esquina superior derecha)\n   • O ve directamente a la página de perfil\n\n2️⃣ **Busca "ProntoPuntos"**\n   • En tu perfil verás una sección de ProntoPuntos\n   • Ahí verás cuántos puntos tienes actualmente\n\n3️⃣ **Ver historial**\n   • Puedes ver cuándo ganaste puntos\n   • Ver cuándo canjeaste puntos\n   • Ver todas tus transacciones de puntos\n\n**También puedes ver:**\n• Recompensas disponibles para canjear\n• Cuántos puntos necesitas para cada recompensa\n• Tu historial de canjes\n\n¿Quieres saber cómo ganar más puntos o cómo canjearlos? 😊`,
      };
    }

    // Sub-opciones de OTROS
    if (selectedOption === 'otros-direcciones') {
      return {
        content: `Te explico cómo gestionar tus direcciones: 📍\n\n**Agregar una dirección:**\n1. Ve a tu perfil\n2. Busca "Direcciones" o "Mis Direcciones"\n3. Haz clic en "Agregar dirección"\n4. Completa los datos:\n   • Etiqueta (Casa, Trabajo, etc.)\n   • Calle y número\n   • Ciudad\n   • Código postal\n   • Notas adicionales (opcional)\n5. Guarda la dirección\n\n**Usar una dirección guardada:**\n• En el checkout, selecciona una de tus direcciones guardadas\n• O agrega una nueva dirección temporalmente\n\n**Editar o eliminar direcciones:**\n• Ve a "Mis Direcciones" en tu perfil\n• Haz clic en la dirección que quieres modificar\n• Edita o elimina según necesites\n\n**Consejos:**\n✅ Guarda varias direcciones para acceso rápido\n✅ Agrega notas útiles (ej: "Puerta azul, timbre 2")\n✅ Marca una como predeterminada\n\n¿Necesitas ayuda para agregar o editar una dirección específica? 😊`,
      };
    }

    if (selectedOption === 'otros-favoritos') {
      return {
        content: `Te explico cómo usar los favoritos: ❤️\n\n**Cómo guardar favoritos:**\n\n🍕 **Restaurantes favoritos:**\n1. Ve a cualquier restaurante\n2. Busca el botón de corazón ❤️\n3. Haz clic para agregarlo a favoritos\n4. Aparecerá en tu sección de favoritos\n\n🍔 **Productos favoritos:**\n1. En el menú del restaurante\n2. Busca el botón de corazón en cada producto\n3. Haz clic para guardarlo\n4. Lo encontrarás fácilmente después\n\n**Ver tus favoritos:**\n• Ve a tu perfil\n• Busca la sección "Favoritos"\n• Ahí verás todos tus restaurantes y productos guardados\n• Puedes hacer clic para ir directamente\n\n**Ventajas:**\n✅ Acceso rápido a tus opciones preferidas\n✅ No necesitas buscar de nuevo\n✅ Fácil de encontrar lo que más te gusta\n✅ Puedes eliminar favoritos cuando quieras\n\n¿Quieres agregar algo a favoritos o necesitas ayuda para encontrarlos? 😊`,
      };
    }

    if (selectedOption === 'otros-cuenta') {
      return {
        content: `Te ayudo con tu cuenta. 👤\n\n**Gestionar tu cuenta:**\n\n**Ver tu perfil:**\n• Haz clic en tu nombre o avatar\n• Ahí verás toda tu información\n\n**Editar información:**\n• Ve a tu perfil\n• Haz clic en "Editar perfil"\n• Puedes cambiar:\n   • Nombre\n   • Email\n   • Foto de perfil\n   • Contraseña\n\n**Ver tu actividad:**\n• Pedidos realizados\n• ProntoPuntos\n• Favoritos\n• Direcciones\n• Reportes\n\n**Configuración:**\n• Preferencias de notificaciones\n• Configuración de privacidad\n• Métodos de pago guardados\n\n¿Qué aspecto de tu cuenta necesitas gestionar? O si tienes un problema específico con tu cuenta, cuéntame y te ayudo. 😊`,
      };
    }

    if (selectedOption === 'otros-tecnico') {
      return {
        content: `Te ayudo con problemas técnicos. 🔧\n\n**Problemas técnicos comunes:**\n\n1️⃣ **La app no carga o está lenta**\n   → Verifica tu conexión a internet\n   → Recarga la página (F5 o Ctrl+R)\n   → Limpia la caché del navegador\n   → Intenta en otro navegador\n\n2️⃣ **No puedo iniciar sesión**\n   → Verifica que tu email y contraseña sean correctos\n   → Intenta recuperar tu contraseña\n   → Verifica que tu cuenta esté activa\n\n3️⃣ **Error al hacer algo**\n   → Recarga la página\n   → Intenta nuevamente en unos minutos\n   → Verifica que estés logueado\n\n4️⃣ **Algo no funciona como debería**\n   → Describe qué estás intentando hacer\n   → Qué error ves (si hay alguno)\n   → En qué parte de la app ocurre\n\n**Si el problema persiste:**\nPuedo conectarte con soporte técnico para que revisen tu caso específico. ¿Quieres que te conecte? 🤝`,
        metadata: {
          type: 'action',
          action: 'request_details',
          canEscalate: true,
        },
      };
    }

    // Si no se reconoce la opción, devolver respuesta genérica
    return {
      content: `Entiendo tu selección. 🤔\n\nPor favor, cuéntame más detalles sobre lo que necesitas y te ayudo específicamente. O si prefieres, puedo conectarte con nuestro equipo de soporte humano. ¿Qué prefieres? 🤝`,
      metadata: {
        type: 'action',
        action: 'request_details',
        canEscalate: true,
      },
    };
  }

  private async getUserContext(userId: string): Promise<UserContext> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        points: true,
        pendingPenalty: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Obtener pedidos recientes
    let recentOrders = [];
    try {
      recentOrders = await this.ordersService.findAll(userId);
      recentOrders = recentOrders.slice(0, 5); // Últimos 5 pedidos
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
    }

    // Obtener reportes
    let reports = [];
    try {
      reports = await this.reportsService.getUserReports(userId);
      reports = reports.slice(0, 5); // Últimos 5 reportes
    } catch (error) {
      console.error('Error al obtener reportes:', error);
    }

    // Obtener restaurantes favoritos
    let favoriteRestaurants = [];
    try {
      favoriteRestaurants = await this.prisma.favorite.findMany({
        where: { userId },
        include: { restaurant: true },
        take: 5,
      });
    } catch (error) {
      console.error('Error al obtener favoritos:', error);
    }

    // Obtener direcciones
    let addresses = [];
    try {
      addresses = await this.prisma.address.findMany({
        where: { userId },
        take: 5,
      });
    } catch (error) {
      console.error('Error al obtener direcciones:', error);
    }

    return {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      recentOrders,
      reports,
      points: user.points,
      favoriteRestaurants,
      addresses,
      pendingPenalty: user.pendingPenalty,
    };
  }

  private analyzeSentiment(message: string): SentimentAnalysis {
    const lowerMessage = message.toLowerCase();
    const words = lowerMessage.split(/\s+/);
    
    // Palabras clave de sentimiento
    const negativeWords = ['no', 'error', 'problema', 'mal', 'malo', 'terrible', 'horrible', 'frustrado', 'molesto', 'enojado', 'furioso', 'no funciona', 'roto', 'falla'];
    const frustratedWords = ['frustrado', 'cansado', 'harto', 'molesto', 'enojado', 'furioso', 'no aguanto', 'ya no puedo'];
    const urgentWords = ['urgente', 'rápido', 'ahora', 'inmediato', 'ya', 'pronto', 'rápidamente', 'asap', 'emergencia'];
    const positiveWords = ['gracias', 'genial', 'perfecto', 'excelente', 'bien', 'bueno', 'ayuda', 'gracias'];
    
    let sentiment: 'positive' | 'neutral' | 'negative' | 'frustrated' | 'urgent' = 'neutral';
    let urgency: 'low' | 'medium' | 'high' = 'low';
    let negativeCount = 0;
    let frustratedCount = 0;
    let urgentCount = 0;
    let positiveCount = 0;
    const keywords: string[] = [];
    
    // Analizar palabras
    words.forEach(word => {
      if (negativeWords.some(nw => word.includes(nw) || lowerMessage.includes(nw))) {
        negativeCount++;
        keywords.push(word);
      }
      if (frustratedWords.some(fw => word.includes(fw) || lowerMessage.includes(fw))) {
        frustratedCount++;
        keywords.push(word);
      }
      if (urgentWords.some(uw => word.includes(uw) || lowerMessage.includes(uw))) {
        urgentCount++;
        keywords.push(word);
      }
      if (positiveWords.some(pw => word.includes(pw) || lowerMessage.includes(pw))) {
        positiveCount++;
      }
    });
    
    // Detectar signos de exclamación múltiples (frustración/urgencia)
    const exclamationCount = (message.match(/!/g) || []).length;
    if (exclamationCount >= 2) {
      urgency = 'high';
      if (negativeCount > 0) {
        sentiment = 'frustrated';
      }
    }
    
    // Determinar sentimiento
    if (urgentCount > 0 && (negativeCount > 0 || frustratedCount > 0)) {
      sentiment = 'urgent';
      urgency = 'high';
    } else if (frustratedCount > 0 || (negativeCount >= 2 && exclamationCount >= 1)) {
      sentiment = 'frustrated';
      urgency = 'medium';
    } else if (negativeCount > 0) {
      sentiment = 'negative';
      urgency = negativeCount >= 2 ? 'high' : 'medium';
    } else if (positiveCount > 0 && negativeCount === 0) {
      sentiment = 'positive';
      urgency = 'low';
    }
    
    // Detectar urgencia por palabras clave adicionales
    if (lowerMessage.includes('no funciona') || lowerMessage.includes('no puedo') || lowerMessage.includes('ayuda')) {
      urgency = urgency === 'low' ? 'medium' : urgency;
    }
    
    const confidence = Math.min(0.9, 0.5 + (negativeCount + frustratedCount + urgentCount) * 0.1);
    
    return {
      sentiment,
      urgency,
      confidence,
      keywords: [...new Set(keywords)],
    };
  }

  private analyzeIntent(message: string, userContext: UserContext): IntentAnalysis {
    const lowerMessage = message.toLowerCase();
    
    // Detectar intenciones comunes
    const intents: Record<string, number> = {
      'check_order_status': 0,
      'report_problem': 0,
      'cancel_order': 0,
      'payment_issue': 0,
      'coupon_help': 0,
      'points_inquiry': 0,
      'make_order': 0,
      'refund_request': 0,
      'general_question': 0,
    };
    
    const entities: Record<string, any> = {};
    
    // Detectar intención de estado de pedido
    if (lowerMessage.includes('estado') || lowerMessage.includes('dónde está') || lowerMessage.includes('donde esta') || 
        (lowerMessage.includes('pedido') && (lowerMessage.includes('llegar') || lowerMessage.includes('tardando')))) {
      intents['check_order_status'] = 0.9;
      if (userContext.recentOrders?.length > 0) {
        entities['orderId'] = userContext.recentOrders[0].id;
      }
    }
    
    // Detectar intención de reportar problema
    if (lowerMessage.includes('problema') || lowerMessage.includes('error') || lowerMessage.includes('no funciona') ||
        lowerMessage.includes('reportar') || lowerMessage.includes('queja')) {
      intents['report_problem'] = 0.9;
    }
    
    // Detectar intención de cancelar
    if (lowerMessage.includes('cancelar') || lowerMessage.includes('cancelación')) {
      intents['cancel_order'] = 0.8;
    }
    
    // Detectar intención de pago
    if (lowerMessage.includes('pago') || lowerMessage.includes('tarjeta') || lowerMessage.includes('efectivo') ||
        lowerMessage.includes('pagar') || lowerMessage.includes('cobro')) {
      intents['payment_issue'] = 0.8;
    }
    
    // Detectar intención de cupón
    if (lowerMessage.includes('cupón') || lowerMessage.includes('cupon') || lowerMessage.includes('descuento') ||
        lowerMessage.includes('promoción') || lowerMessage.includes('promocion')) {
      intents['coupon_help'] = 0.8;
    }
    
    // Detectar intención de puntos
    if (lowerMessage.includes('punto') || lowerMessage.includes('prontopunto') || lowerMessage.includes('recompensa')) {
      intents['points_inquiry'] = 0.8;
    }
    
    // Detectar intención de hacer pedido
    if (lowerMessage.includes('pedir') || lowerMessage.includes('ordenar') || lowerMessage.includes('comprar')) {
      intents['make_order'] = 0.7;
    }
    
    // Detectar intención de reembolso
    if (lowerMessage.includes('reembolso') || lowerMessage.includes('devolución') || lowerMessage.includes('devolucion') ||
        lowerMessage.includes('dinero de vuelta')) {
      intents['refund_request'] = 0.9;
    }
    
    // Detectar números (posible ID de pedido)
    const orderIdMatch = message.match(/\b[a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12}\b/i);
    if (orderIdMatch) {
      entities['orderId'] = orderIdMatch[0];
    }
    
    // Detectar montos
    const amountMatch = message.match(/\$\d+(\.\d{2})?/);
    if (amountMatch) {
      entities['amount'] = amountMatch[0];
    }
    
    // Determinar intención principal
    const sortedIntents = Object.entries(intents).sort((a, b) => b[1] - a[1]);
    const primaryIntent = sortedIntents[0][0];
    const confidence = sortedIntents[0][1];
    
    return {
      intent: primaryIntent,
      entities,
      confidence,
      requiresAction: confidence > 0.7 && ['report_problem', 'cancel_order', 'refund_request', 'payment_issue'].includes(primaryIntent),
    };
  }

  private async generateAIResponse(
    userMessage: string,
    messageHistory: any[],
    userContext: UserContext,
    sentiment?: SentimentAnalysis,
    intent?: IntentAnalysis,
  ): Promise<{ content: string; metadata?: any }> {
    // Si no hay API key de OpenAI, usar respuestas predefinidas
    if (!this.useOpenAI) {
      return this.getFallbackResponse(userMessage, userContext);
    }

    try {
      // Construir el prompt del sistema con restricciones
      const systemPrompt = this.buildSystemPrompt(userContext, sentiment, intent);

      // Construir el historial de mensajes para el contexto
      const conversationHistory = messageHistory
        .slice(-10) // Últimos 10 mensajes para contexto
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

      // Llamar a OpenAI
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            ...conversationHistory,
            { role: 'user', content: userMessage },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || 'Lo siento, no pude procesar tu mensaje.';

      return {
        content: aiResponse,
      };
    } catch (error) {
      console.error('Error al generar respuesta con IA:', error);
      // Fallback a respuestas predefinidas
      return this.getFallbackResponse(userMessage, userContext);
    }
  }

  private buildSystemPrompt(userContext: UserContext, sentiment?: SentimentAnalysis, intent?: IntentAnalysis): string {
    const ordersInfo = userContext.recentOrders?.length
      ? `\n\nPedidos recientes del usuario:\n${userContext.recentOrders
          .map(
            (order: any) =>
              `- Pedido ${order.id}: ${order.status}, Total: $${order.total}, Restaurante: ${order.restaurant?.name || 'N/A'}, Fecha: ${order.createdAt}`,
          )
          .join('\n')}`
      : '\n\nEl usuario no tiene pedidos recientes.';

    const reportsInfo = userContext.reports?.length
      ? `\n\nReportes del usuario:\n${userContext.reports
          .map(
            (report: any) =>
              `- Reporte ${report.id}: ${report.type}, Estado: ${report.status}, Razón: ${report.reason}`,
          )
          .join('\n')}`
      : '\n\nEl usuario no tiene reportes.';

    const pointsInfo = userContext.points !== undefined
      ? `\n\nProntoPuntos del usuario: ${userContext.points} puntos${userContext.pendingPenalty ? ` (Penalización pendiente: $${userContext.pendingPenalty})` : ''}`
      : '';

    const favoritesInfo = userContext.favoriteRestaurants?.length
      ? `\n\nRestaurantes favoritos del usuario: ${userContext.favoriteRestaurants.map((f: any) => f.restaurant?.name).filter(Boolean).join(', ')}`
      : '';

    const sentimentInfo = sentiment
      ? `\n\nANÁLISIS DE SENTIMIENTO DEL MENSAJE ACTUAL:\n- Sentimiento: ${sentiment.sentiment}\n- Urgencia: ${sentiment.urgency}\n- Confianza: ${sentiment.confidence}\n- Palabras clave: ${sentiment.keywords.join(', ')}\n\nIMPORTANTE: Si el sentimiento es "frustrated" o "urgent", muestra más empatía y ofrece conectar con soporte humano inmediatamente. Si es "negative", valida sus sentimientos antes de dar soluciones.`
      : '';

    const intentInfo = intent
      ? `\n\nANÁLISIS DE INTENCIÓN:\n- Intención detectada: ${intent.intent}\n- Confianza: ${intent.confidence}\n- Requiere acción: ${intent.requiresAction}\n- Entidades extraídas: ${JSON.stringify(intent.entities)}\n\nUsa esta información para dar una respuesta más precisa y contextual.`
      : '';

    return `Eres un asistente virtual de soporte para ProntoClick, una aplicación de delivery de comida. Tu nombre es "Asistente ProntoClick" y eres amigable, empático, profesional y muy humanizado.${sentimentInfo}${intentInfo}

PERSONALIDAD Y TONO:
- Sé cálido, amigable y comprensivo como un compañero de trabajo amigable
- Usa un lenguaje natural y conversacional, evita sonar robótico
- Muestra empatía genuina cuando el usuario tiene problemas ("Entiendo tu frustración", "Lamento que esto te haya pasado")
- Celebra cuando ayudas a resolver algo ("¡Genial! Me alegra haberte ayudado")
- Sé paciente y claro en tus explicaciones, usa ejemplos cuando sea útil
- Usa emojis ocasionalmente para hacer la conversación más amigable (1-2 por mensaje máximo)
- Reconoce cuando no sabes algo y admítelo honestamente
- Si el usuario está frustrado, valida sus sentimientos antes de ofrecer soluciones

REGLAS ESTRICTAS:
1. SOLO puedes responder preguntas relacionadas con ProntoClick y sus funcionalidades
2. NO puedes responder preguntas sobre otros temas (política, deportes, noticias, etc.)
3. Si el usuario pregunta algo fuera del contexto, redirige amablemente: "Lo siento, solo puedo ayudarte con temas relacionados a ProntoClick. ¿Hay algo sobre la aplicación en lo que pueda ayudarte?"
4. Si después de 2-3 intentos no puedes resolver el problema del usuario, DEBES ofrecer conectar con soporte humano
5. Cuando ofrezcas conectar con soporte humano, sé empático: "Entiendo que esto es frustrante y que he intentado ayudarte pero parece que tu problema requiere atención más personalizada. ¿Te parece bien si te conecto con nuestro equipo de soporte humano? Ellos podrán ayudarte mejor con este tema específico."

ESTRATEGIA DE AYUDA DETALLADA:
1. Cuando el usuario pida ayuda, primero identifica el problema específico haciendo preguntas claras
2. Ofrece opciones de problemas comunes relacionados al tema (ej: "¿Es que no puedes agregar productos al carrito, o el problema es al pagar?")
3. Una vez identificado el problema, proporciona soluciones paso a paso, numeradas y detalladas
4. Explica el "por qué" de cada paso cuando sea relevante
5. Si el problema persiste después de intentar solucionarlo, ofrece conectar con soporte humano
6. Si el usuario menciona que algo "no funciona" o "hay un error", pregunta detalles específicos antes de dar soluciones genéricas
7. Si el usuario acaba de seleccionar una opción de un menú y ahora está proporcionando detalles, usa ese contexto para dar una respuesta más específica y útil
8. Si el usuario ha intentado varias soluciones y el problema persiste, DEBES ofrecer conectar con soporte humano de forma clara y empática

INFORMACIÓN DEL USUARIO:
- Nombre: ${userContext.userName}
- Email: ${userContext.userEmail}${ordersInfo}${reportsInfo}${pointsInfo}${favoritesInfo}

FUNCIONALIDADES DETALLADAS DE PRONTOCLICK:
1. Hacer pedidos: Selecciona restaurante → Agrega productos al carrito → Checkout con dirección → Método de pago → Confirmar
2. Estados de pedidos: pending (pendiente), confirmed (confirmado), preparing (preparando), ready (listo), on_the_way (en camino), delivered (entregado), cancelled (cancelado), scheduled (programado)
3. Reportes: Para problemas con pedidos, cancelaciones, reembolsos, productos incorrectos, demoras
4. Cupones: Se aplican en el checkout, pueden ser porcentuales, fijos, o envío gratis
5. ProntoPuntos: Se ganan con compras, se canjean por recompensas en el perfil
6. Pedidos programados: Se pueden programar hasta 30 días en el futuro
7. Favoritos: Guardar restaurantes y productos para acceso rápido

PROBLEMAS COMUNES Y SOLUCIONES:
- Pedido no llega: Verificar estado, contactar restaurante, crear reporte
- Producto incorrecto: Crear reporte con detalles, solicitar reembolso
- No puedo pagar: Verificar método de pago, tarjeta válida, saldo suficiente
- Cupón no funciona: Verificar código, fecha de validez, pedido mínimo
- Pedido cancelado: Revisar razón, verificar penalización, crear reporte si es injusto

CONTEXTO DE MENÚS INTERACTIVOS:
- El usuario puede haber seleccionado una opción de un menú anterior
- Si el usuario está proporcionando detalles después de seleccionar una opción, usa ese contexto
- Si el problema es complejo o no puedes resolverlo después de 2-3 intentos, ofrece conectar con soporte humano
- Cuando ofrezcas conectar con soporte humano, sé empático: "Entiendo que esto es frustrante. Déjame conectarte con nuestro equipo de soporte humano que podrá ayudarte mejor. ¿Te parece bien?"

Responde siempre en español, sé detallado cuando expliques soluciones, y ofrece conectar con soporte humano cuando sea necesario.`;
  }

  private getFallbackResponse(
    userMessage: string,
    userContext: UserContext,
  ): { content: string; metadata?: any } {
    const lowerMessage = userMessage.toLowerCase();
    const words = lowerMessage.split(/\s+/);

    // ============================================
    // PREGUNTAS ESPECÍFICAS SOBRE MÉTODOS DE PAGO
    // ============================================
    if (
      (lowerMessage.includes('pagar') || lowerMessage.includes('pago') || lowerMessage.includes('pago')) &&
      (lowerMessage.includes('tarjeta') || lowerMessage.includes('débito') || lowerMessage.includes('credito') || 
       lowerMessage.includes('crédito') || lowerMessage.includes('efectivo') || lowerMessage.includes('card') ||
       lowerMessage.includes('cash') || lowerMessage.includes('método') || lowerMessage.includes('metodo'))
    ) {
      if (lowerMessage.includes('tarjeta') || lowerMessage.includes('débito') || lowerMessage.includes('credito') || lowerMessage.includes('crédito') || lowerMessage.includes('card')) {
        return {
          content: `¡Sí! Puedes pagar con tarjeta de débito o crédito. 💳\n\n**Métodos de pago disponibles en ProntoClick:**\n\n💳 **Tarjeta de Crédito o Débito**\n   • Aceptamos todas las tarjetas principales (Visa, Mastercard, Amex)\n   • El pago se procesa de forma segura con Stripe\n   • Solo necesitas ingresar los datos de tu tarjeta una vez\n   • El pago se cobra cuando confirmas el pedido\n\n💵 **Efectivo**\n   • Puedes pagar en efectivo cuando recibas tu pedido\n   • El repartidor traerá el cambio exacto\n   • Asegúrate de tener el dinero listo\n\n**Cómo pagar con tarjeta:**\n1. En el checkout, selecciona "Tarjeta" como método de pago\n2. Ingresa los datos de tu tarjeta (número, fecha de vencimiento, CVV)\n3. Confirma tu pedido\n4. El pago se procesará automáticamente\n\n**Seguridad:**\n✅ Tus datos de tarjeta están protegidos\n✅ No guardamos los números completos de tu tarjeta\n✅ Usamos encriptación de nivel bancario\n\n¿Tienes algún problema al pagar con tarjeta o necesitas ayuda con otro método de pago? 😊`,
        };
      }
      
      if (lowerMessage.includes('efectivo') || lowerMessage.includes('cash')) {
        return {
          content: `¡Sí! Puedes pagar en efectivo. 💵\n\n**Pago en efectivo:**\n• Selecciona "Efectivo" como método de pago en el checkout\n• El repartidor traerá el cambio exacto\n• Asegúrate de tener el dinero listo cuando llegue tu pedido\n• El pago se realiza al momento de la entrega\n\n**Ventajas del pago en efectivo:**\n✅ No necesitas tarjeta\n✅ Pagas solo cuando recibes tu pedido\n✅ El repartidor trae cambio\n\n¿Necesitas ayuda con algo más sobre el pago? 😊`,
        };
      }

      return {
        content: `Te explico los métodos de pago disponibles en ProntoClick: 💳\n\n**Métodos de pago:**\n\n💳 **Tarjeta (Crédito o Débito)**\n   • Visa, Mastercard, American Express\n   • Pago seguro con Stripe\n   • Se cobra al confirmar el pedido\n\n💵 **Efectivo**\n   • Pagas cuando recibes tu pedido\n   • El repartidor trae cambio\n   • No necesitas tarjeta\n\n**Cómo elegir el método de pago:**\n1. En el checkout, verás la opción "Método de pago"\n2. Selecciona "Tarjeta" o "Efectivo"\n3. Si eliges tarjeta, completa los datos\n4. Confirma tu pedido\n\n¿Prefieres pagar con tarjeta o efectivo? O si tienes algún problema con el pago, cuéntame y te ayudo. 😊`,
      };
    }

    // ============================================
    // PREGUNTAS ESPECÍFICAS SOBRE FUNCIONALIDADES
    // ============================================
    
    // Preguntas sobre programar pedidos
    if (
      (lowerMessage.includes('programar') || lowerMessage.includes('programado') || lowerMessage.includes('futuro')) &&
      (lowerMessage.includes('pedido') || lowerMessage.includes('orden'))
    ) {
      return {
        content: `¡Sí! Puedes programar pedidos para el futuro. 📅\n\n**Pedidos programados:**\n\n✅ **Cómo programar un pedido:**\n1. Agrega productos al carrito normalmente\n2. En el checkout, activa la opción "Programar pedido"\n3. Selecciona la fecha y hora deseada\n4. Completa el resto del proceso normalmente\n\n⏰ **Límites:**\n• Puedes programar hasta 30 días en el futuro\n• La hora debe ser en el futuro (no puedes programar para el pasado)\n• El pedido se procesará automáticamente en la fecha/hora seleccionada\n\n💡 **Ventajas:**\n• Planifica tus comidas con anticipación\n• Asegura tu pedido aunque el restaurante esté cerrado\n• Perfecto para eventos o reuniones\n\n**Ver pedidos programados:**\n• Ve a "Mis Pedidos" en tu perfil\n• Los pedidos programados aparecen con el estado "Programado"\n• Puedes cancelarlos antes de la fecha programada\n\n¿Quieres programar un pedido o necesitas ayuda con algo específico sobre pedidos programados? 😊`,
      };
    }

    // Preguntas sobre favoritos
    if (
      (lowerMessage.includes('favorito') || lowerMessage.includes('guardar') || lowerMessage.includes('marcar')) &&
      (lowerMessage.includes('restaurante') || lowerMessage.includes('producto') || lowerMessage.includes('comida'))
    ) {
      return {
        content: `¡Sí! Puedes guardar restaurantes y productos favoritos. ❤️\n\n**Cómo guardar favoritos:**\n\n🍕 **Restaurantes favoritos:**\n1. Ve a cualquier restaurante\n2. Busca el botón de corazón ❤️\n3. Haz clic para agregarlo a favoritos\n4. Aparecerá en tu sección de favoritos\n\n🍔 **Productos favoritos:**\n1. En el menú del restaurante\n2. Busca el botón de corazón en cada producto\n3. Haz clic para guardarlo\n4. Lo encontrarás fácilmente después\n\n**Ver tus favoritos:**\n• Ve a tu perfil\n• Busca la sección "Favoritos"\n• Ahí verás todos tus restaurantes y productos guardados\n\n**Ventajas:**\n✅ Acceso rápido a tus opciones preferidas\n✅ No necesitas buscar de nuevo\n✅ Fácil de encontrar lo que más te gusta\n\n¿Quieres agregar algo a favoritos o necesitas ayuda para encontrarlos? 😊`,
      };
    }

    // Preguntas sobre direcciones
    if (
      (lowerMessage.includes('dirección') || lowerMessage.includes('direccion') || lowerMessage.includes('domicilio') || lowerMessage.includes('direccion')) &&
      (lowerMessage.includes('agregar') || lowerMessage.includes('guardar') || lowerMessage.includes('cambiar') || lowerMessage.includes('editar') || lowerMessage.includes('cómo') || lowerMessage.includes('como'))
    ) {
      return {
        content: `Te explico cómo gestionar tus direcciones: 📍\n\n**Agregar una dirección:**\n1. Ve a tu perfil\n2. Busca "Direcciones" o "Mis Direcciones"\n3. Haz clic en "Agregar dirección"\n4. Completa los datos:\n   • Etiqueta (Casa, Trabajo, etc.)\n   • Calle y número\n   • Ciudad\n   • Código postal\n   • Notas adicionales (opcional)\n5. Guarda la dirección\n\n**Usar una dirección guardada:**\n• En el checkout, selecciona una de tus direcciones guardadas\n• O agrega una nueva dirección temporalmente\n\n**Editar o eliminar direcciones:**\n• Ve a "Mis Direcciones" en tu perfil\n• Haz clic en la dirección que quieres modificar\n• Edita o elimina según necesites\n\n**Consejos:**\n✅ Guarda varias direcciones para acceso rápido\n✅ Agrega notas útiles (ej: "Puerta azul, timbre 2")\n✅ Marca una como predeterminada\n\n¿Necesitas ayuda para agregar o editar una dirección específica? 😊`,
      };
    }

    // Preguntas sobre propinas
    if (lowerMessage.includes('propina') || lowerMessage.includes('tip')) {
      return {
        content: `Sí, puedes dejar propina para el repartidor. 💰\n\n**Sobre las propinas:**\n\n✅ **Cómo dejar propina:**\n• En el checkout, verás la opción "Propina"\n• Puedes elegir un monto fijo o porcentaje\n• O dejar $0 si prefieres\n• La propina se suma al total del pedido\n\n💡 **Cuándo se cobra:**\n• Si pagas con tarjeta: se cobra junto con el pedido\n• Si pagas en efectivo: puedes darla directamente al repartidor\n\n**Importante:**\n• La propina es opcional pero muy apreciada por los repartidores\n• Puedes ajustar el monto antes de confirmar\n• No hay monto mínimo ni máximo\n\n¿Tienes alguna pregunta sobre las propinas? 😊`,
      };
    }

    // Preguntas sobre cancelaciones
    if (
      (lowerMessage.includes('cancelar') || lowerMessage.includes('cancelación') || lowerMessage.includes('cancelacion')) &&
      (lowerMessage.includes('pedido') || lowerMessage.includes('orden'))
    ) {
      return {
        content: `Te explico cómo cancelar un pedido y qué implica: ❌\n\n**Cómo cancelar un pedido:**\n1. Ve a "Mis Pedidos" en tu perfil\n2. Selecciona el pedido que quieres cancelar\n3. Haz clic en "Cancelar pedido"\n4. Indica la razón de la cancelación\n5. Confirma la cancelación\n\n**Cuándo puedes cancelar:**\n✅ Pedidos pendientes o confirmados: Sin costo\n✅ Pedidos en preparación: Sin costo\n⚠️ Pedidos en camino: Se aplica un cargo del 20% del total\n❌ Pedidos entregados: No se pueden cancelar\n\n**Penalización por cancelaciones:**\n• Si cancelas un pedido en camino, hay un cargo del 20%\n• Si cancelas varios pedidos, se aplica una penalización del 5% en tu próximo pedido\n• Esta penalización se suma al total de tu siguiente compra\n\n**Reembolsos:**\n• Si cancelas a tiempo, recibirás reembolso completo\n• Si cancelas en camino, se descontará el 20%\n• Los reembolsos tardan 3-5 días hábiles\n\n¿Necesitas cancelar un pedido específico o tienes dudas sobre las penalizaciones? 😊`,
      };
    }

    // Preguntas sobre tiempos de entrega
    if (
      (lowerMessage.includes('tiempo') || lowerMessage.includes('cuánto') || lowerMessage.includes('cuanto') || lowerMessage.includes('demora') || lowerMessage.includes('tarda')) &&
      (lowerMessage.includes('entrega') || lowerMessage.includes('llegar') || lowerMessage.includes('pedido'))
    ) {
      return {
        content: `Te explico los tiempos de entrega en ProntoClick: ⏰\n\n**Tiempos típicos de entrega:**\n\n⏱️ **Tiempo promedio:** 30-45 minutos\n   • Desde que confirmas el pedido\n   • Hasta que llega a tu puerta\n\n**Factores que afectan el tiempo:**\n• Distancia del restaurante a tu dirección\n• Tráfico en el momento\n• Tiempo de preparación del restaurante\n• Disponibilidad de repartidores\n\n**Estados y tiempos:**\n• **Pendiente/Confirmado:** 0-5 minutos\n• **En preparación:** 15-25 minutos\n• **Listo:** 5-10 minutos\n• **En camino:** 10-20 minutos\n• **Entregado:** ¡Llegó! 🎉\n\n**Si tu pedido tarda más de 1 hora:**\n1. Verifica el estado en "Mis Pedidos"\n2. Si está "en camino" pero tarda, puedes crear un reporte\n3. Nuestro equipo revisará tu caso\n\n**Pedidos programados:**\n• Se preparan y envían en la fecha/hora programada\n• El tiempo de entrega comienza desde ese momento\n\n¿Tu pedido está tardando más de lo normal? Cuéntame y te ayudo. 😊`,
      };
    }

    // Preguntas sobre costos y precios
    if (
      (lowerMessage.includes('costo') || lowerMessage.includes('precio') || lowerMessage.includes('cuánto') || lowerMessage.includes('cuanto') || lowerMessage.includes('cuesta')) &&
      (lowerMessage.includes('envío') || lowerMessage.includes('envio') || lowerMessage.includes('delivery') || lowerMessage.includes('entrega'))
    ) {
      return {
        content: `Te explico los costos de envío: 💰\n\n**Costo de envío:**\n• **Costo fijo:** $2.99 por pedido\n• Se suma al total de tu pedido\n• Aplica a todos los pedidos\n\n**Cómo evitar el costo de envío:**\n🎟️ **Usa un cupón de envío gratis**\n   • Algunos cupones incluyen envío gratis\n   • Aplícalo en el checkout\n   • El costo de envío se eliminará\n\n**Otros costos:**\n• **Productos:** Precio según el menú del restaurante\n• **Impuestos:** 10% sobre el subtotal\n• **Propina:** Opcional, el monto que elijas\n• **Penalización:** Solo si cancelas pedidos (5% en próximo pedido)\n\n**Total del pedido incluye:**\n✅ Subtotal (productos)\n✅ Envío ($2.99)\n✅ Impuestos (10%)\n✅ Propina (si la agregas)\n✅ Descuento de cupón (si aplicas uno)\n\n¿Tienes alguna pregunta sobre los costos o quieres saber cómo obtener envío gratis? 😊`,
      };
    }

    // Detectar intención del usuario - PEDIDOS
    if (
      lowerMessage.includes('pedido') ||
      lowerMessage.includes('orden') ||
      lowerMessage.includes('comprar') ||
      lowerMessage.includes('ordenar') ||
      lowerMessage.includes('hacer pedido')
    ) {
      // Si pregunta sobre problemas con pedidos
      if (
        lowerMessage.includes('problema') ||
        lowerMessage.includes('error') ||
        lowerMessage.includes('no puedo') ||
        lowerMessage.includes('no funciona')
      ) {
        return {
          content: `Entiendo que tienes un problema al hacer tu pedido. 😔 Déjame ayudarte a identificar qué está pasando:\n\n**Problemas comunes al hacer pedidos:**\n\n1️⃣ **No puedo agregar productos al carrito**\n   → Verifica que estés logueado\n   → Recarga la página\n   → Limpia la caché del navegador\n\n2️⃣ **No puedo completar el checkout**\n   → Verifica que tengas una dirección guardada\n   → Asegúrate de tener método de pago configurado\n   → Revisa que el pedido mínimo se cumpla\n\n3️⃣ **El pago no se procesa**\n   → Verifica que tu tarjeta tenga fondos\n   → Revisa que los datos de la tarjeta sean correctos\n   → Intenta con otro método de pago\n\n4️⃣ **Error al confirmar el pedido**\n   → Verifica tu conexión a internet\n   → Intenta nuevamente en unos minutos\n   → Revisa que todos los campos estén completos\n\n¿Cuál de estos problemas estás experimentando? O si es algo diferente, cuéntame más detalles y te ayudo. 🤗`,
        };
      }

      return {
        content: `¡Perfecto! Te explico paso a paso cómo hacer un pedido en ProntoClick: 📦\n\n**Paso 1: Explora restaurantes** 🍕\n   • Ve a la página principal\n   • Navega por los restaurantes disponibles\n   • Puedes usar filtros o buscar por nombre\n\n**Paso 2: Selecciona productos** 🛒\n   • Entra al restaurante que te guste\n   • Agrega productos al carrito\n   • Puedes ajustar las cantidades\n\n**Paso 3: Ve al checkout** 💳\n   • Haz clic en el carrito (esquina inferior derecha)\n   • Revisa tu pedido\n   • Completa tu dirección de entrega\n\n**Paso 4: Método de pago** 💰\n   • Elige entre efectivo o tarjeta\n   • Si usas tarjeta, completa los datos\n   • Puedes aplicar un cupón si tienes uno\n\n**Paso 5: Confirma** ✅\n   • Revisa todo una última vez\n   • Confirma tu pedido\n   • ¡Listo! Recibirás una confirmación\n\n¿En qué paso específico necesitas más ayuda? O si tienes algún problema, cuéntame y te ayudo a resolverlo. 😊`,
      };
    }

    // ESTADO DE PEDIDOS
    if (
      lowerMessage.includes('estado') ||
      lowerMessage.includes('status') ||
      lowerMessage.includes('dónde está') ||
      lowerMessage.includes('mi pedido') ||
      lowerMessage.includes('pedido no llega') ||
      lowerMessage.includes('tardando')
    ) {
      const ordersInfo =
        userContext.recentOrders?.length > 0
          ? `\n\n**Tus pedidos recientes:** 📋\n${userContext.recentOrders
              .slice(0, 3)
              .map((order: any) => {
                const statusEmoji = {
                  pending: '⏳',
                  confirmed: '✅',
                  preparing: '👨‍🍳',
                  ready: '📦',
                  on_the_way: '🚗',
                  delivered: '🎉',
                  cancelled: '❌',
                  scheduled: '📅',
                }[order.status] || '📋';
                
                const statusText = {
                  pending: 'Pendiente de confirmación',
                  confirmed: 'Confirmado',
                  preparing: 'En preparación',
                  ready: 'Listo para entrega',
                  on_the_way: 'En camino',
                  delivered: 'Entregado',
                  cancelled: 'Cancelado',
                  scheduled: 'Programado',
                }[order.status] || order.status;

                return `   ${statusEmoji} Pedido ${order.id.substring(0, 8)}... - ${statusText}`;
              })
              .join('\n')}`
          : '\n\nNo tienes pedidos recientes.';

      // Si el pedido está tardando o no llega
      if (lowerMessage.includes('tardando') || lowerMessage.includes('no llega') || lowerMessage.includes('demora')) {
        const pendingOrders = userContext.recentOrders?.filter(
          (o: any) => ['pending', 'confirmed', 'preparing', 'ready', 'on_the_way'].includes(o.status)
        ) || [];

        if (pendingOrders.length > 0) {
          return {
            content: `Entiendo tu preocupación. 😟 Veo que tienes ${pendingOrders.length} pedido(s) en proceso. Déjame ayudarte:\n\n**¿Qué puedes hacer si tu pedido está tardando?**\n\n1️⃣ **Verifica el estado actual**\n   • Ve a "Mis Pedidos" en tu perfil\n   • Revisa el estado del pedido\n   • Los tiempos normales son 30-45 minutos\n\n2️⃣ **Si está en "preparando" o "listo"**\n   • El restaurante está trabajando en tu pedido\n   • Esto es normal, ten paciencia 😊\n   • Si pasa más de 1 hora, puedes crear un reporte\n\n3️⃣ **Si está "en camino"**\n   • Tu pedido ya salió del restaurante\n   • Debería llegar pronto\n   • Puedes seguir el rastreo en tiempo real\n\n4️⃣ **Si lleva más de 1 hora**\n   • Puedes crear un reporte desde "Mis Pedidos"\n   • Selecciona el pedido y "Reportar problema"\n   • Nuestro equipo revisará tu caso\n\n${ordersInfo}\n\n¿Quieres que te ayude a crear un reporte o necesitas más información sobre algún pedido específico?`,
          };
        }
      }

      return {
        content: `Te explico cómo ver el estado de tus pedidos y qué significa cada estado: 📊\n\n**Estados de pedidos:**\n\n⏳ **Pendiente** - Tu pedido está esperando confirmación del restaurante\n✅ **Confirmado** - El restaurante aceptó tu pedido y lo está preparando\n👨‍🍳 **En preparación** - Tu comida se está cocinando\n📦 **Listo** - Tu pedido está listo y saldrá en camino\n🚗 **En camino** - El repartidor está llevando tu pedido\n🎉 **Entregado** - ¡Tu pedido llegó! Disfrútalo\n❌ **Cancelado** - El pedido fue cancelado\n📅 **Programado** - Pedido programado para el futuro\n\n**Para ver tus pedidos:**\n• Ve a tu perfil → "Mis Pedidos"\n• Ahí verás todos tus pedidos con su estado actual\n• Puedes hacer clic en cada uno para ver más detalles${ordersInfo}\n\n¿Necesitas ayuda con algún pedido específico o tienes algún problema?`,
      };
    }

    // REPORTES Y PROBLEMAS
    if (
      lowerMessage.includes('reporte') ||
      lowerMessage.includes('problema') ||
      lowerMessage.includes('reembolso') ||
      lowerMessage.includes('queja') ||
      lowerMessage.includes('error') ||
      lowerMessage.includes('mal') ||
      lowerMessage.includes('incorrecto')
    ) {
      const reportsInfo =
        userContext.reports?.length > 0
          ? `\n\n**Tus reportes anteriores:** 📝\n${userContext.reports
              .slice(0, 3)
              .map((report: any) => {
                const statusEmoji = {
                  pending: '⏳',
                  reviewed: '👀',
                  resolved: '✅',
                  rejected: '❌',
                }[report.status] || '📋';
                
                return `   ${statusEmoji} Reporte ${report.id.substring(0, 8)}... - ${report.type} (${report.status})`;
              })
              .join('\n')}`
          : '\n\nNo tienes reportes anteriores.';

      // Si menciona un problema específico
      if (
        lowerMessage.includes('producto') ||
        lowerMessage.includes('comida') ||
        lowerMessage.includes('faltante') ||
        lowerMessage.includes('equivocado')
      ) {
        return {
          content: `Lamento mucho que hayas recibido un producto incorrecto o que falte algo. 😔 Te ayudo a resolverlo:\n\n**Pasos para reportar un problema con tu pedido:**\n\n1️⃣ **Ve a "Mis Pedidos"**\n   • Encuentra el pedido con el problema\n   • Haz clic en "Ver detalles"\n\n2️⃣ **Crea un reporte**\n   • Busca el botón "Reportar problema"\n   • Selecciona el tipo de problema:\n     - Producto incorrecto\n     - Producto faltante\n     - Producto en mal estado\n     - Otro problema\n\n3️⃣ **Describe el problema**\n   • Sé específico sobre qué salió mal\n   • Menciona qué productos están afectados\n   • Agrega cualquier detalle relevante\n\n4️⃣ **Envía el reporte**\n   • Nuestro equipo lo revisará en 24-48 horas\n   • Te contactaremos con una solución\n   • Podemos ofrecer reembolso o reposición\n\n${reportsInfo}\n\n¿Necesitas ayuda para crear el reporte o tienes alguna pregunta sobre el proceso? Si el problema es urgente, puedo conectarte con nuestro equipo de soporte humano. 🤝`,
        };
      }

      if (lowerMessage.includes('reembolso') || lowerMessage.includes('devolución')) {
        return {
          content: `Te explico cómo solicitar un reembolso: 💰\n\n**Para solicitar un reembolso:**\n\n1️⃣ **Crea un reporte del problema**\n   • Ve a "Mis Pedidos"\n   • Selecciona el pedido afectado\n   • Crea un reporte explicando el problema\n\n2️⃣ **Menciona que quieres reembolso**\n   • En la descripción del reporte\n   • Indica que deseas un reembolso\n   • Explica por qué (producto incorrecto, no llegó, etc.)\n\n3️⃣ **Revisión del equipo**\n   • Nuestro equipo revisará tu caso\n   • Si es válido, procesaremos el reembolso\n   • Te notificaremos cuando esté listo\n\n**Tiempos de reembolso:**\n• Revisión: 24-48 horas\n• Procesamiento: 3-5 días hábiles\n• El dinero volverá a tu método de pago original\n\n${reportsInfo}\n\n¿Quieres que te ayude a crear el reporte ahora? O si prefieres, puedo conectarte directamente con soporte humano para acelerar el proceso. 🤝`,
        };
      }

      return {
        content: `Estoy aquí para ayudarte a resolver cualquier problema. 🛠️\n\n**¿Qué tipo de problema tienes?**\n\n1️⃣ **Problema con un pedido**\n   • Producto incorrecto o faltante\n   • Pedido que no llegó\n   • Pedido tardando mucho\n   • Problema con el pago\n\n2️⃣ **Problema con la cuenta**\n   • No puedo iniciar sesión\n   • Problema con mis datos\n   • Problema con ProntoPuntos\n\n3️⃣ **Problema técnico**\n   • La app no funciona\n   • Error al hacer algo\n   • Problema con cupones\n\n4️⃣ **Solicitar reembolso**\n   • Pedido cancelado\n   • Producto incorrecto\n   • Otro motivo\n\n**Para crear un reporte:**\n• Ve a "Mis Pedidos" → Selecciona el pedido → "Reportar problema"\n• O desde tu perfil → "Reportes" → "Crear reporte"\n\n${reportsInfo}\n\nCuéntame qué problema específico tienes y te guío paso a paso para resolverlo. Si es algo complejo, puedo conectarte con nuestro equipo de soporte humano. 🤝`,
      };
    }

    // CUPONES Y PROMOCIONES
    if (
      lowerMessage.includes('cupón') ||
      lowerMessage.includes('descuento') ||
      lowerMessage.includes('promoción') ||
      lowerMessage.includes('código')
    ) {
      // Si el cupón no funciona
      if (lowerMessage.includes('no funciona') || lowerMessage.includes('no aplica') || lowerMessage.includes('error')) {
        return {
          content: `Entiendo que tienes problemas con un cupón. 😔 Déjame ayudarte a identificar el problema:\n\n**Razones comunes por las que un cupón no funciona:**\n\n1️⃣ **Código incorrecto**\n   • Verifica que escribiste el código correctamente\n   • Revisa mayúsculas y minúsculas\n   • Asegúrate de no tener espacios extra\n\n2️⃣ **Cupón expirado**\n   • Los cupones tienen fecha de vencimiento\n   • Verifica que aún esté vigente\n   • Algunos cupones son de uso único\n\n3️⃣ **No cumples los requisitos**\n   • Algunos cupones requieren pedido mínimo\n   • Verifica que tu pedido cumpla el monto\n   • Algunos cupones son solo para ciertos restaurantes\n\n4️⃣ **Ya lo usaste**\n   • Algunos cupones son de un solo uso\n   • Revisa si ya lo aplicaste antes\n\n**Cómo aplicar un cupón correctamente:**\n• Ve al checkout\n• Busca el campo "Código de cupón"\n• Ingresa el código exactamente como aparece\n• Haz clic en "Aplicar"\n• Verifica que el descuento aparezca antes de confirmar\n\nSi después de verificar todo esto el cupón sigue sin funcionar, puedo conectarte con soporte humano para que revisen tu caso específico. 🤝`,
        };
      }

      return {
        content: `¡Genial! Te explico todo sobre cupones y promociones: 🎟️\n\n**Tipos de cupones disponibles:**\n\n💰 **Descuento porcentual**\n   • Ejemplo: 20% de descuento\n   • Se aplica sobre el subtotal\n\n💵 **Descuento fijo**\n   • Ejemplo: $5 de descuento\n   • Se resta del total\n\n🚚 **Envío gratis**\n   • Elimina el costo de envío\n   • Ahorra $2.99\n\n**Cómo usar un cupón:**\n\n1️⃣ **Obtén el código del cupón**\n   • Puede venir por email\n   • O estar en promociones activas\n   • O ser parte de una recompensa\n\n2️⃣ **Agrega productos al carrito**\n   • Asegúrate de cumplir el pedido mínimo si aplica\n\n3️⃣ **Ve al checkout**\n   • Busca el campo "Código de cupón"\n   • Ingresa el código exactamente\n   • Haz clic en "Aplicar"\n\n4️⃣ **Verifica el descuento**\n   • Deberías ver el descuento aplicado\n   • Revisa el total final\n   • Confirma tu pedido\n\n**Consejos:**\n• Los cupones se aplican antes de confirmar\n• Algunos tienen fecha de vencimiento\n• Verifica los términos y condiciones\n\n¿Tienes un código específico que quieres usar o tienes algún problema con un cupón? 😊`,
      };
    }

    // PRONTOPUNTOS Y RECOMPENSAS
    if (lowerMessage.includes('punto') || lowerMessage.includes('recompensa') || lowerMessage.includes('prontopunto')) {
      return {
        content: `¡Te explico todo sobre ProntoPuntos! ⭐\n\n**¿Qué son los ProntoPuntos?**\nSon puntos que ganas con cada compra y puedes canjear por recompensas especiales.\n\n**Cómo ganar puntos:**\n💰 **Con cada compra**\n   • Ganas puntos según el monto de tu pedido\n   • Los puntos se acreditan automáticamente\n   • Se suman a tu cuenta\n\n**Cómo usar tus puntos:**\n\n1️⃣ **Ve a tu perfil**\n   • Busca la sección "ProntoPuntos"\n   • Verás cuántos puntos tienes\n\n2️⃣ **Explora recompensas**\n   • Ve a "Recompensas disponibles"\n   • Cada recompensa tiene un costo en puntos\n\n3️⃣ **Canjea tu recompensa**\n   • Selecciona la que te guste\n   • Confirma el canje\n   • Recibirás un código o cupón\n\n**Tipos de recompensas:**\n🎟️ Cupones de descuento\n🎁 Productos gratis\n🚚 Envío gratis\n💰 Descuentos especiales\n\n**Consejos:**\n• Los puntos no expiran\n• Acumula puntos para mejores recompensas\n• Revisa las recompensas disponibles regularmente\n\n¿Quieres saber cuántos puntos tienes o cómo canjear una recompensa específica? 😊`,
      };
    }

    // ============================================
    // PREGUNTAS ESPECÍFICAS SOBRE MÉTODOS DE PAGO
    // ============================================
    if (
      (lowerMessage.includes('pagar') || lowerMessage.includes('pago') || lowerMessage.includes('pago')) &&
      (lowerMessage.includes('tarjeta') || lowerMessage.includes('débito') || lowerMessage.includes('credito') || 
       lowerMessage.includes('crédito') || lowerMessage.includes('efectivo') || lowerMessage.includes('card') ||
       lowerMessage.includes('cash') || lowerMessage.includes('método') || lowerMessage.includes('metodo'))
    ) {
      if (lowerMessage.includes('tarjeta') || lowerMessage.includes('débito') || lowerMessage.includes('credito') || lowerMessage.includes('crédito') || lowerMessage.includes('card')) {
        return {
          content: `¡Sí! Puedes pagar con tarjeta de débito o crédito. 💳\n\n**Métodos de pago disponibles en ProntoClick:**\n\n💳 **Tarjeta de Crédito o Débito**\n   • Aceptamos todas las tarjetas principales (Visa, Mastercard, Amex)\n   • El pago se procesa de forma segura con Stripe\n   • Solo necesitas ingresar los datos de tu tarjeta una vez\n   • El pago se cobra cuando confirmas el pedido\n\n💵 **Efectivo**\n   • Puedes pagar en efectivo cuando recibas tu pedido\n   • El repartidor traerá el cambio exacto\n   • Asegúrate de tener el dinero listo\n\n**Cómo pagar con tarjeta:**\n1. En el checkout, selecciona "Tarjeta" como método de pago\n2. Ingresa los datos de tu tarjeta (número, fecha de vencimiento, CVV)\n3. Confirma tu pedido\n4. El pago se procesará automáticamente\n\n**Seguridad:**\n✅ Tus datos de tarjeta están protegidos\n✅ No guardamos los números completos de tu tarjeta\n✅ Usamos encriptación de nivel bancario\n\n¿Tienes algún problema al pagar con tarjeta o necesitas ayuda con otro método de pago? 😊`,
        };
      }
      
      if (lowerMessage.includes('efectivo') || lowerMessage.includes('cash')) {
        return {
          content: `¡Sí! Puedes pagar en efectivo. 💵\n\n**Pago en efectivo:**\n• Selecciona "Efectivo" como método de pago en el checkout\n• El repartidor traerá el cambio exacto\n• Asegúrate de tener el dinero listo cuando llegue tu pedido\n• El pago se realiza al momento de la entrega\n\n**Ventajas del pago en efectivo:**\n✅ No necesitas tarjeta\n✅ Pagas solo cuando recibes tu pedido\n✅ El repartidor trae cambio\n\n¿Necesitas ayuda con algo más sobre el pago? 😊`,
        };
      }

      return {
        content: `Te explico los métodos de pago disponibles en ProntoClick: 💳\n\n**Métodos de pago:**\n\n💳 **Tarjeta (Crédito o Débito)**\n   • Visa, Mastercard, American Express\n   • Pago seguro con Stripe\n   • Se cobra al confirmar el pedido\n\n💵 **Efectivo**\n   • Pagas cuando recibes tu pedido\n   • El repartidor trae cambio\n   • No necesitas tarjeta\n\n**Cómo elegir el método de pago:**\n1. En el checkout, verás la opción "Método de pago"\n2. Selecciona "Tarjeta" o "Efectivo"\n3. Si eliges tarjeta, completa los datos\n4. Confirma tu pedido\n\n¿Prefieres pagar con tarjeta o efectivo? O si tienes algún problema con el pago, cuéntame y te ayudo. 😊`,
      };
    }

    // ============================================
    // PREGUNTAS ESPECÍFICAS SOBRE FUNCIONALIDADES
    // ============================================
    
    // Preguntas sobre programar pedidos
    if (
      (lowerMessage.includes('programar') || lowerMessage.includes('programado') || lowerMessage.includes('futuro')) &&
      (lowerMessage.includes('pedido') || lowerMessage.includes('orden'))
    ) {
      return {
        content: `¡Sí! Puedes programar pedidos para el futuro. 📅\n\n**Pedidos programados:**\n\n✅ **Cómo programar un pedido:**\n1. Agrega productos al carrito normalmente\n2. En el checkout, activa la opción "Programar pedido"\n3. Selecciona la fecha y hora deseada\n4. Completa el resto del proceso normalmente\n\n⏰ **Límites:**\n• Puedes programar hasta 30 días en el futuro\n• La hora debe ser en el futuro (no puedes programar para el pasado)\n• El pedido se procesará automáticamente en la fecha/hora seleccionada\n\n💡 **Ventajas:**\n• Planifica tus comidas con anticipación\n• Asegura tu pedido aunque el restaurante esté cerrado\n• Perfecto para eventos o reuniones\n\n**Ver pedidos programados:**\n• Ve a "Mis Pedidos" en tu perfil\n• Los pedidos programados aparecen con el estado "Programado"\n• Puedes cancelarlos antes de la fecha programada\n\n¿Quieres programar un pedido o necesitas ayuda con algo específico sobre pedidos programados? 😊`,
      };
    }

    // Preguntas sobre favoritos
    if (
      (lowerMessage.includes('favorito') || lowerMessage.includes('guardar') || lowerMessage.includes('marcar')) &&
      (lowerMessage.includes('restaurante') || lowerMessage.includes('producto') || lowerMessage.includes('comida'))
    ) {
      return {
        content: `¡Sí! Puedes guardar restaurantes y productos favoritos. ❤️\n\n**Cómo guardar favoritos:**\n\n🍕 **Restaurantes favoritos:**\n1. Ve a cualquier restaurante\n2. Busca el botón de corazón ❤️\n3. Haz clic para agregarlo a favoritos\n4. Aparecerá en tu sección de favoritos\n\n🍔 **Productos favoritos:**\n1. En el menú del restaurante\n2. Busca el botón de corazón en cada producto\n3. Haz clic para guardarlo\n4. Lo encontrarás fácilmente después\n\n**Ver tus favoritos:**\n• Ve a tu perfil\n• Busca la sección "Favoritos"\n• Ahí verás todos tus restaurantes y productos guardados\n\n**Ventajas:**\n✅ Acceso rápido a tus opciones preferidas\n✅ No necesitas buscar de nuevo\n✅ Fácil de encontrar lo que más te gusta\n\n¿Quieres agregar algo a favoritos o necesitas ayuda para encontrarlos? 😊`,
      };
    }

    // Preguntas sobre direcciones
    if (
      (lowerMessage.includes('dirección') || lowerMessage.includes('direccion') || lowerMessage.includes('domicilio')) &&
      (lowerMessage.includes('agregar') || lowerMessage.includes('guardar') || lowerMessage.includes('cambiar') || lowerMessage.includes('editar') || lowerMessage.includes('cómo') || lowerMessage.includes('como'))
    ) {
      return {
        content: `Te explico cómo gestionar tus direcciones: 📍\n\n**Agregar una dirección:**\n1. Ve a tu perfil\n2. Busca "Direcciones" o "Mis Direcciones"\n3. Haz clic en "Agregar dirección"\n4. Completa los datos:\n   • Etiqueta (Casa, Trabajo, etc.)\n   • Calle y número\n   • Ciudad\n   • Código postal\n   • Notas adicionales (opcional)\n5. Guarda la dirección\n\n**Usar una dirección guardada:**\n• En el checkout, selecciona una de tus direcciones guardadas\n• O agrega una nueva dirección temporalmente\n\n**Editar o eliminar direcciones:**\n• Ve a "Mis Direcciones" en tu perfil\n• Haz clic en la dirección que quieres modificar\n• Edita o elimina según necesites\n\n**Consejos:**\n✅ Guarda varias direcciones para acceso rápido\n✅ Agrega notas útiles (ej: "Puerta azul, timbre 2")\n✅ Marca una como predeterminada\n\n¿Necesitas ayuda para agregar o editar una dirección específica? 😊`,
      };
    }

    // Preguntas sobre propinas
    if (lowerMessage.includes('propina') || lowerMessage.includes('tip')) {
      return {
        content: `Sí, puedes dejar propina para el repartidor. 💰\n\n**Sobre las propinas:**\n\n✅ **Cómo dejar propina:**\n• En el checkout, verás la opción "Propina"\n• Puedes elegir un monto fijo o porcentaje\n• O dejar $0 si prefieres\n• La propina se suma al total del pedido\n\n💡 **Cuándo se cobra:**\n• Si pagas con tarjeta: se cobra junto con el pedido\n• Si pagas en efectivo: puedes darla directamente al repartidor\n\n**Importante:**\n• La propina es opcional pero muy apreciada por los repartidores\n• Puedes ajustar el monto antes de confirmar\n• No hay monto mínimo ni máximo\n\n¿Tienes alguna pregunta sobre las propinas? 😊`,
      };
    }

    // Preguntas sobre cancelaciones
    if (
      (lowerMessage.includes('cancelar') || lowerMessage.includes('cancelación') || lowerMessage.includes('cancelacion')) &&
      (lowerMessage.includes('pedido') || lowerMessage.includes('orden'))
    ) {
      return {
        content: `Te explico cómo cancelar un pedido y qué implica: ❌\n\n**Cómo cancelar un pedido:**\n1. Ve a "Mis Pedidos" en tu perfil\n2. Selecciona el pedido que quieres cancelar\n3. Haz clic en "Cancelar pedido"\n4. Indica la razón de la cancelación\n5. Confirma la cancelación\n\n**Cuándo puedes cancelar:**\n✅ Pedidos pendientes o confirmados: Sin costo\n✅ Pedidos en preparación: Sin costo\n⚠️ Pedidos en camino: Se aplica un cargo del 20% del total\n❌ Pedidos entregados: No se pueden cancelar\n\n**Penalización por cancelaciones:**\n• Si cancelas un pedido en camino, hay un cargo del 20%\n• Si cancelas varios pedidos, se aplica una penalización del 5% en tu próximo pedido\n• Esta penalización se suma al total de tu siguiente compra\n\n**Reembolsos:**\n• Si cancelas a tiempo, recibirás reembolso completo\n• Si cancelas en camino, se descontará el 20%\n• Los reembolsos tardan 3-5 días hábiles\n\n¿Necesitas cancelar un pedido específico o tienes dudas sobre las penalizaciones? 😊`,
      };
    }

    // Preguntas sobre tiempos de entrega
    if (
      (lowerMessage.includes('tiempo') || lowerMessage.includes('cuánto') || lowerMessage.includes('cuanto') || lowerMessage.includes('demora') || lowerMessage.includes('tarda')) &&
      (lowerMessage.includes('entrega') || lowerMessage.includes('llegar') || lowerMessage.includes('pedido'))
    ) {
      return {
        content: `Te explico los tiempos de entrega en ProntoClick: ⏰\n\n**Tiempos típicos de entrega:**\n\n⏱️ **Tiempo promedio:** 30-45 minutos\n   • Desde que confirmas el pedido\n   • Hasta que llega a tu puerta\n\n**Factores que afectan el tiempo:**\n• Distancia del restaurante a tu dirección\n• Tráfico en el momento\n• Tiempo de preparación del restaurante\n• Disponibilidad de repartidores\n\n**Estados y tiempos:**\n• **Pendiente/Confirmado:** 0-5 minutos\n• **En preparación:** 15-25 minutos\n• **Listo:** 5-10 minutos\n• **En camino:** 10-20 minutos\n• **Entregado:** ¡Llegó! 🎉\n\n**Si tu pedido tarda más de 1 hora:**\n1. Verifica el estado en "Mis Pedidos"\n2. Si está "en camino" pero tarda, puedes crear un reporte\n3. Nuestro equipo revisará tu caso\n\n**Pedidos programados:**\n• Se preparan y envían en la fecha/hora programada\n• El tiempo de entrega comienza desde ese momento\n\n¿Tu pedido está tardando más de lo normal? Cuéntame y te ayudo. 😊`,
      };
    }

    // Preguntas sobre costos y precios
    if (
      (lowerMessage.includes('costo') || lowerMessage.includes('precio') || lowerMessage.includes('cuánto') || lowerMessage.includes('cuanto') || lowerMessage.includes('cuesta')) &&
      (lowerMessage.includes('envío') || lowerMessage.includes('envio') || lowerMessage.includes('delivery') || lowerMessage.includes('entrega'))
    ) {
      return {
        content: `Te explico los costos de envío: 💰\n\n**Costo de envío:**\n• **Costo fijo:** $2.99 por pedido\n• Se suma al total de tu pedido\n• Aplica a todos los pedidos\n\n**Cómo evitar el costo de envío:**\n🎟️ **Usa un cupón de envío gratis**\n   • Algunos cupones incluyen envío gratis\n   • Aplícalo en el checkout\n   • El costo de envío se eliminará\n\n**Otros costos:**\n• **Productos:** Precio según el menú del restaurante\n• **Impuestos:** 10% sobre el subtotal\n• **Propina:** Opcional, el monto que elijas\n• **Penalización:** Solo si cancelas pedidos (5% en próximo pedido)\n\n**Total del pedido incluye:**\n✅ Subtotal (productos)\n✅ Envío ($2.99)\n✅ Impuestos (10%)\n✅ Propina (si la agregas)\n✅ Descuento de cupón (si aplicas uno)\n\n¿Tienes alguna pregunta sobre los costos o quieres saber cómo obtener envío gratis? 😊`,
      };
    }

    // ============================================
    // PREGUNTAS DE SÍ/NO O ESPECÍFICAS
    // ============================================
    
    // Preguntas que empiezan con "puedo", "se puede", "es posible"
    if (
      lowerMessage.startsWith('puedo') ||
      lowerMessage.startsWith('se puede') ||
      lowerMessage.startsWith('es posible') ||
      lowerMessage.startsWith('puede') ||
      lowerMessage.includes('¿puedo') ||
      lowerMessage.includes('?puedo')
    ) {
      // Preguntas sobre funcionalidades específicas
      if (lowerMessage.includes('cancelar') && lowerMessage.includes('pedido')) {
        return {
          content: `¡Sí! Puedes cancelar pedidos, pero depende del estado: ✅\n\n**Cuándo puedes cancelar sin costo:**\n• Pedidos pendientes o confirmados\n• Pedidos en preparación\n\n**Cuándo hay cargo por cancelar:**\n⚠️ Pedidos en camino: Se aplica un cargo del 20% del total\n\n**Cuándo NO puedes cancelar:**\n❌ Pedidos ya entregados\n\n**Cómo cancelar:**\n1. Ve a "Mis Pedidos"\n2. Selecciona el pedido\n3. Haz clic en "Cancelar pedido"\n4. Indica la razón\n\n¿Quieres cancelar un pedido específico? Cuéntame el estado y te ayudo. 😊`,
        };
      }

      if (lowerMessage.includes('programar') || lowerMessage.includes('futuro')) {
        return {
          content: `¡Sí! Puedes programar pedidos hasta 30 días en el futuro. 📅\n\nEn el checkout, activa "Programar pedido" y selecciona fecha/hora. ¿Quieres más detalles sobre cómo hacerlo? 😊`,
        };
      }

      if (lowerMessage.includes('favorito') || lowerMessage.includes('guardar')) {
        return {
          content: `¡Sí! Puedes guardar restaurantes y productos favoritos. ❤️\n\nBusca el botón de corazón en restaurantes o productos. ¿Necesitas ayuda para encontrarlos después? 😊`,
        };
      }

      if (lowerMessage.includes('reembolso') || lowerMessage.includes('devolución')) {
        return {
          content: `¡Sí! Puedes solicitar reembolsos. 💰\n\nCrea un reporte desde "Mis Pedidos" explicando el problema. Si es válido, procesamos el reembolso en 3-5 días. ¿Quieres ayuda para crear el reporte? 😊`,
        };
      }
    }

    // Si no puede ayudar después de varios intentos o pregunta algo muy complejo
    if (
      lowerMessage.includes('no entiendo') ||
      lowerMessage.includes('no funciona') ||
      lowerMessage.includes('no puedo') ||
      lowerMessage.includes('ayuda humana') ||
      lowerMessage.includes('soporte humano') ||
      lowerMessage.includes('hablar con alguien')
    ) {
      return {
        content: `Entiendo que esto puede ser frustrante. 😔\n\nHe intentado ayudarte, pero parece que tu problema requiere atención más personalizada. No te preocupes, estoy aquí para conectarte con nuestro equipo de soporte humano que podrá ayudarte mejor.\n\n**¿Qué puedo hacer por ti?**\n\n✅ Puedo ayudarte a crear un reporte detallado de tu problema\n✅ Puedo darte información sobre cómo contactar soporte\n✅ Puedo guiarte paso a paso si me das más detalles\n\n**O si prefieres:**\n🤝 Puedo preparar un resumen de tu problema para que cuando te conectes con soporte humano, ya tengan toda la información\n\n¿Qué prefieres hacer? Si quieres, cuéntame más detalles sobre tu problema y veré si puedo ayudarte, o te preparo todo para que hables con nuestro equipo. 😊`,
        metadata: { needsHumanSupport: true },
      };
    }

    // Detectar si es una pregunta (tiene signo de interrogación o palabras interrogativas)
    const isQuestion = 
      lowerMessage.includes('?') || 
      lowerMessage.includes('qué') || 
      lowerMessage.includes('que') ||
      lowerMessage.includes('cómo') ||
      lowerMessage.includes('como') ||
      lowerMessage.includes('cuál') ||
      lowerMessage.includes('cual') ||
      lowerMessage.includes('cuándo') ||
      lowerMessage.includes('cuando') ||
      lowerMessage.includes('dónde') ||
      lowerMessage.includes('donde') ||
      lowerMessage.includes('por qué') ||
      lowerMessage.includes('porque') ||
      lowerMessage.startsWith('puedo') ||
      lowerMessage.startsWith('se puede');

    if (isQuestion) {
      return {
        content: `Entiendo tu pregunta, pero necesito un poco más de contexto para darte la mejor respuesta. 🤔\n\n**¿Podrías ser más específico?** Por ejemplo:\n\n• Si preguntas sobre pagos: ¿Tarjeta, efectivo, o problemas al pagar?\n• Si preguntas sobre pedidos: ¿Cómo hacer uno, estado, o cancelar?\n• Si preguntas sobre funcionalidades: ¿Qué función específica te interesa?\n\n**También puedo ayudarte con:**\n\n📦 Hacer pedidos paso a paso\n💳 Métodos de pago (tarjeta/efectivo)\n📊 Estado de pedidos\n🐛 Reportar problemas\n🎟️ Cupones y promociones\n⭐ ProntoPuntos\n📅 Pedidos programados\n❤️ Favoritos\n📍 Direcciones\n💰 Costos y envíos\n\nCuéntame más detalles sobre lo que necesitas y te ayudo específicamente. 😊`,
        metadata: { needsMoreInfo: true },
      };
    }

    // Respuesta por defecto - más humanizada
    return {
      content: `¡Hola! 👋 Estoy aquí para ayudarte. Puedo asistirte con varios temas:\n\n**¿En qué puedo ayudarte?**\n\n📦 **Hacer pedidos**\n   • Guía paso a paso\n   • Solución de problemas al ordenar\n\n💳 **Métodos de pago**\n   • Tarjeta de crédito/débito\n   • Pago en efectivo\n   • Problemas con pagos\n\n📊 **Estado de pedidos**\n   • Ver dónde está tu pedido\n   • Qué hacer si tarda\n\n🐛 **Reportar problemas**\n   • Productos incorrectos\n   • Pedidos que no llegaron\n   • Solicitar reembolsos\n\n🎟️ **Cupones y promociones**\n   • Cómo usar cupones\n   • Problemas con códigos\n\n⭐ **ProntoPuntos**\n   • Cómo ganar puntos\n   • Canjear recompensas\n\n📅 **Pedidos programados**\n   • Cómo programar pedidos\n\n❤️ **Favoritos**\n   • Guardar restaurantes y productos\n\n📍 **Direcciones**\n   • Agregar y gestionar direcciones\n\n💰 **Costos**\n   • Envíos, impuestos, propinas\n\nSolo dime qué necesitas específicamente y te ayudo paso a paso. Si tu problema es muy complejo, puedo conectarte con nuestro equipo de soporte humano. 😊\n\n¿En qué puedo ayudarte hoy?`,
    };
  }

  async closeSession(sessionId: string, userId: string) {
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('Sesión no encontrada');
    }

    if (session.userId !== userId) {
      throw new BadRequestException('No tienes permiso para cerrar esta sesión');
    }

    return this.prisma.chatSession.update({
      where: { id: sessionId },
      data: { status: 'closed' },
    });
  }
}

