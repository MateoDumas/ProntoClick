import { Injectable } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';
import { ChatGateway } from '../chat/chat.gateway';

@Injectable()
export class SupportService {
  constructor(
    private prisma: PrismaService,
    private chatGateway: ChatGateway,
  ) {}

  // Obtener todos los chats activos que requieren atención
  async getActiveChats() {
    const activeSessions = await this.prisma.chatSession.findMany({
      where: {
        status: 'active',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1, // Último mensaje
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    console.log(`[SupportService] Encontradas ${activeSessions.length} sesiones activas`);

    // Filtrar sesiones que tienen metadata indicando necesidad de soporte humano
    const sessionsNeedingSupport = await Promise.all(
      activeSessions.map(async (session) => {
        const lastMessage = await this.prisma.chatMessage.findFirst({
          where: { sessionId: session.id },
          orderBy: { createdAt: 'desc' },
        });

        const metadata = lastMessage?.metadata as any;
        const needsSupport =
          metadata?.canEscalate === true ||
          metadata?.needsHumanSupport === true ||
          metadata?.connectingToSupport === true ||
          metadata?.sentiment === 'frustrated' ||
          metadata?.sentiment === 'urgent' ||
          metadata?.urgency === 'high';

        return {
          ...session,
          needsSupport,
          lastMessage: lastMessage?.content,
          lastMessageTime: lastMessage?.createdAt,
        };
      }),
    );

    // Retornar TODAS las sesiones activas, priorizando las que necesitan soporte
    // Ordenar: primero las que necesitan soporte, luego por fecha de actualización
    const allSessions = sessionsNeedingSupport.sort((a, b) => {
      // Primero las que necesitan soporte
      if (a.needsSupport && !b.needsSupport) return -1;
      if (!a.needsSupport && b.needsSupport) return 1;
      // Luego por fecha de actualización (más recientes primero)
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    // Retornar TODAS las sesiones activas (sin filtrar)
    // Esto permite al soporte ver todos los chats activos, incluso los que aún no necesitan soporte
    console.log(`[SupportService] Retornando ${allSessions.length} sesiones (${allSessions.filter(s => s.needsSupport).length} necesitan soporte)`);
    return allSessions;
  }

  // Obtener todos los chats resueltos
  async getResolvedChats() {
    const resolvedSessions = await this.prisma.chatSession.findMany({
      where: {
        status: 'resolved',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1, // Último mensaje
        },
        survey: {
          include: {
            supportUser: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    console.log(`[SupportService] Encontradas ${resolvedSessions.length} sesiones resueltas`);

    // Procesar sesiones resueltas con información adicional
    const processedSessions = await Promise.all(
      resolvedSessions.map(async (session) => {
        const lastMessage = await this.prisma.chatMessage.findFirst({
          where: { sessionId: session.id },
          orderBy: { createdAt: 'desc' },
        });

        return {
          ...session,
          lastMessage: lastMessage?.content,
          lastMessageTime: lastMessage?.createdAt,
          hasSurvey: !!session.survey,
          surveyRating: session.survey?.rating,
          surveyComment: session.survey?.comment,
          resolvedBy: session.survey?.supportUser,
        };
      }),
    );

    return processedSessions;
  }

  // Obtener todos los reportes pendientes
  async getPendingReports() {
    return this.prisma.report.findMany({
      where: {
        status: {
          in: ['pending', 'reviewed'],
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        order: {
          include: {
            restaurant: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Obtener detalles completos de un reporte específico
  async getReportDetails(reportId: string) {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            phoneNumber: true,
          },
        },
        order: {
          include: {
            restaurant: {
              select: {
                id: true,
                name: true,
                image: true,
                description: true,
              },
            },
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    image: true,
                  },
                },
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!report) {
      throw new Error('Reporte no encontrado');
    }

    return report;
  }

  // Obtener pedidos con reportes
  async getOrdersWithReports() {
    const reports = await this.prisma.report.findMany({
      where: {
        status: {
          in: ['pending', 'reviewed'],
        },
      },
      include: {
        order: {
          include: {
            restaurant: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            items: {
              include: {
                product: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Agrupar por pedido
    const ordersMap = new Map();
    reports.forEach((report) => {
      if (report.orderId) {
        if (!ordersMap.has(report.orderId)) {
          ordersMap.set(report.orderId, {
            order: report.order,
            reports: [],
          });
        }
        ordersMap.get(report.orderId).reports.push({
          id: report.id,
          type: report.type,
          reason: report.reason,
          status: report.status,
          createdAt: report.createdAt,
          user: report.user,
        });
      }
    });

    return Array.from(ordersMap.values());
  }

  // Obtener estadísticas del dashboard
  async getDashboardStats() {
    try {
      console.log('[SupportService] Iniciando getDashboardStats...');
      
      // Obtener todas las sesiones activas y contar las que necesitan soporte
      const activeSessions = await this.prisma.chatSession.findMany({
        where: { status: 'active' },
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      });
      
      console.log(`[SupportService] Encontradas ${activeSessions.length} sesiones activas`);

      // Contar chats que necesitan soporte basándose en el metadata del último mensaje
      let chatsNeedingSupport = 0;
      for (const session of activeSessions) {
        if (session.messages && session.messages.length > 0) {
          const lastMessage = session.messages[0];
          const metadata = lastMessage.metadata as any;
          if (
            metadata?.canEscalate === true ||
            metadata?.needsHumanSupport === true ||
            metadata?.connectingToSupport === true ||
            metadata?.sentiment === 'frustrated' ||
            metadata?.sentiment === 'urgent' ||
            metadata?.urgency === 'high'
          ) {
            chatsNeedingSupport++;
          }
        }
      }

      const [pendingReports, inProgressReports, allReportsWithOrders] = await Promise.all([
        this.prisma.report.count({
          where: { status: 'pending' },
        }),
        this.prisma.report.count({
          where: { status: 'reviewed' },
        }),
        this.prisma.report.findMany({
          where: {
            status: {
              in: ['pending', 'reviewed'],
            },
            // orderId es requerido en el schema, así que no necesitamos filtrar por null
          },
          select: {
            orderId: true,
          },
        }),
      ]);

      // Obtener orderIds únicos
      const uniqueOrderIds = new Set(allReportsWithOrders.map((r) => r.orderId).filter(Boolean));

      const stats = {
        totalActiveChats: activeSessions.length,
        chatsNeedingSupport,
        pendingReports,
        inProgressReports,
        totalOrdersWithReports: uniqueOrderIds.size,
      };

      console.log('[SupportService] Stats calculadas:', stats);
      return stats;
    } catch (error) {
      console.error('[SupportService] Error en getDashboardStats:', error);
      console.error('[SupportService] Stack trace:', error?.stack);
      // Retornar valores por defecto en caso de error para que el dashboard no falle completamente
      return {
        totalActiveChats: 0,
        chatsNeedingSupport: 0,
        pendingReports: 0,
        inProgressReports: 0,
        totalOrdersWithReports: 0,
      };
    }
  }

  // Actualizar estado de un reporte
  async updateReportStatus(reportId: string, status: string, notes?: string) {
    return this.prisma.report.update({
      where: { id: reportId },
      data: {
        status,
        ...(notes && { notes }),
        updatedAt: new Date(),
      },
    });
  }

  // Obtener historial de un chat específico
  async getChatHistory(sessionId: string) {
    return this.prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  // Enviar mensaje como soporte humano
  async sendSupportMessage(sessionId: string, content: string, supportUserId: string) {
    // Verificar que la sesión existe
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!session) {
      throw new Error('Sesión no encontrada');
    }

    // Crear mensaje del soporte
    const supportMessage = await this.prisma.chatMessage.create({
      data: {
        sessionId,
        role: 'assistant',
        content: `[Soporte Humano] ${content}`,
        metadata: {
          fromSupport: true,
          supportUserId,
          timestamp: new Date().toISOString(),
        },
      },
    });

    // Actualizar timestamp de la sesión
    await this.prisma.chatSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() },
    });

    // Emitir mensaje por WebSocket a la sesión del usuario
    this.chatGateway.server.to(`session:${sessionId}`).emit('support_message', {
      message: supportMessage,
      fromSupport: true,
    });

    // También emitir al usuario específico
    this.chatGateway.server.to(`user:${session.userId}`).emit('support_message', {
      message: supportMessage,
      fromSupport: true,
      sessionId,
    });

    return supportMessage;
  }

  // Crear encuesta de satisfacción para un chat (solo la envía, sin completar)
  async createSurvey(sessionId: string, supportUserId: string) {
    try {
      // Verificar que la sesión existe y está activa
      const session = await this.prisma.chatSession.findUnique({
        where: { id: sessionId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!session) {
        throw new Error('Sesión no encontrada');
      }

      if (session.status === 'closed' || session.status === 'resolved') {
        throw new Error('No se puede crear una encuesta para una sesión cerrada o resuelta');
      }

      // Verificar si ya existe una encuesta para esta sesión
      const existingSurvey = await this.prisma.supportSurvey.findUnique({
        where: { sessionId },
      });

      if (existingSurvey) {
        throw new Error('Ya existe una encuesta para esta sesión');
      }

      // Crear la encuesta pendiente (sin rating ni comment aún)
      // Si rating no es nullable, usar un valor temporal que luego se actualizará
      // Primero intentar con null, si falla usar un valor temporal
      let survey;
      try {
        survey = await this.prisma.supportSurvey.create({
          data: {
            sessionId,
            supportUserId,
            rating: null, // El usuario lo completará
            comment: null,
          },
        });
      } catch (nullError: any) {
        // Si falla por null constraint, el campo rating no es nullable
        // Usar un valor temporal (0) que luego se actualizará cuando el usuario complete
        console.warn('[SupportService] rating no es nullable, usando valor temporal 0');
        survey = await this.prisma.supportSurvey.create({
          data: {
            sessionId,
            supportUserId,
            rating: 0, // Valor temporal, se actualizará cuando el usuario complete
            comment: null,
          },
        });
      }

      // Enviar mensaje al usuario notificando que hay una encuesta pendiente
      const surveyMessage = await this.prisma.chatMessage.create({
        data: {
          sessionId,
          role: 'assistant',
          content: '¡Gracias por contactarnos! Por favor, completa nuestra breve encuesta de satisfacción para ayudarnos a mejorar nuestro servicio.',
          metadata: {
            type: 'survey',
            surveyId: survey.id,
            fromSupport: true,
          } as any,
        },
      });

      // Emitir evento WebSocket para notificar al usuario sobre la encuesta
      try {
        if (this.chatGateway?.server) {
          this.chatGateway.server.to(`session:${sessionId}`).emit('survey_available', {
            sessionId,
            surveyId: survey.id,
            message: surveyMessage,
          });

          // También emitir al usuario específico
          this.chatGateway.server.to(`user:${session.userId}`).emit('survey_available', {
            sessionId,
            surveyId: survey.id,
            message: surveyMessage,
          });
        }
      } catch (wsError) {
        console.warn('[SupportService] Error al emitir evento WebSocket (no crítico):', wsError);
        // No lanzar error, el mensaje ya se creó en la BD
      }

      // Programar auto-resolución después de 1 minuto
      // El chat se marcará como resuelto automáticamente, sin importar si el usuario completa la encuesta
      setTimeout(async () => {
        try {
          // Verificar si el chat ya está resuelto (por si el usuario completó la encuesta antes)
          const currentSession = await this.prisma.chatSession.findUnique({
            where: { id: sessionId },
          });

          if (currentSession && currentSession.status !== 'resolved') {
            // Marcar el chat como resuelto
            await this.prisma.chatSession.update({
              where: { id: sessionId },
              data: { status: 'resolved' },
            });

            // Actualizar resolvedAt en la encuesta si aún no está resuelta
            const currentSurvey = await this.prisma.supportSurvey.findUnique({
              where: { id: survey.id },
            });

            if (currentSurvey && !currentSurvey.resolvedAt) {
              await this.prisma.supportSurvey.update({
                where: { id: survey.id },
                data: { resolvedAt: new Date() },
              });
            }

            // Notificar al usuario que el caso fue resuelto
            if (this.chatGateway?.server) {
              this.chatGateway.server.to(`session:${sessionId}`).emit('case_resolved', {
                sessionId,
                message: 'Tu caso ha sido marcado como resuelto. ¡Gracias por contactarnos!',
              });

              this.chatGateway.server.to(`user:${session.userId}`).emit('case_resolved', {
                sessionId,
                message: 'Tu caso ha sido marcado como resuelto. ¡Gracias por contactarnos!',
              });
            }

            console.log(`[SupportService] Chat ${sessionId} marcado como resuelto automáticamente después de 1 minuto`);
          }
        } catch (error) {
          console.error('[SupportService] Error al marcar chat como resuelto automáticamente:', error);
        }
      }, 60000); // 1 minuto = 60000 ms

      // Retornar la encuesta con los datos necesarios
      return {
        id: survey.id,
        sessionId: survey.sessionId,
        supportUserId: survey.supportUserId,
        rating: survey.rating,
        comment: survey.comment,
        createdAt: survey.createdAt,
        resolvedAt: survey.resolvedAt,
      };
    } catch (error: any) {
      console.error('[SupportService] Error al crear encuesta:', error);
      console.error('[SupportService] Error details:', {
        message: error.message,
        code: error.code,
        meta: error.meta,
        stack: error.stack,
      });
      
      // Si el error es sobre rating null, dar un mensaje más claro
      if (error.message?.includes('null') || error.code === 'P2002' || error.code === 'P2003') {
        throw new Error('Error al crear la encuesta. Asegúrate de que el campo rating sea nullable en la base de datos. Ejecuta el script SQL: update-survey-rating-nullable.sql');
      }
      
      // Re-lanzar el error con más información
      throw new Error(`Error al crear encuesta: ${error.message || JSON.stringify(error)}`);
    }
  }

  // El usuario completa la encuesta
  async submitSurvey(sessionId: string, rating: number, comment?: string) {
    // Verificar que la sesión existe
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new Error('Sesión no encontrada');
    }

    // Buscar la encuesta pendiente
    const survey = await this.prisma.supportSurvey.findUnique({
      where: { sessionId },
    });

    if (!survey) {
      throw new Error('No se encontró una encuesta para esta sesión');
    }

    // Verificar si la encuesta ya fue completada (rating null o mayor a 0)
    if (survey.rating !== null && survey.rating > 0) {
      throw new Error('Esta encuesta ya fue completada');
    }

    // Actualizar la encuesta con el rating y comment del usuario
    const updatedSurvey = await this.prisma.supportSurvey.update({
      where: { id: survey.id },
      data: {
        rating,
        comment: comment || null,
        resolvedAt: new Date(),
      },
      include: {
        session: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        supportUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Marcar el chat como resuelto
    await this.prisma.chatSession.update({
      where: { id: sessionId },
      data: { status: 'resolved' },
    });

    // Notificar al usuario que el caso fue resuelto
    this.chatGateway.server.to(`session:${sessionId}`).emit('case_resolved', {
      sessionId,
      message: '¡Gracias por completar la encuesta! Tu caso ha sido marcado como resuelto.',
    });

    // También emitir al usuario específico
    this.chatGateway.server.to(`user:${session.userId}`).emit('case_resolved', {
      sessionId,
      message: '¡Gracias por completar la encuesta! Tu caso ha sido marcado como resuelto.',
    });

    return updatedSurvey;
  }

  // Obtener estadísticas de encuestas de soporte (solo completadas)
  async getSurveyStats(supportUserId?: string) {
    // Solo contar encuestas completadas (rating no null y mayor a 0)
    const where = supportUserId 
      ? { 
          supportUserId,
          rating: { not: null },
        }
      : { 
          rating: { not: null },
        };

    const [total, averageRating, ratings] = await Promise.all([
      this.prisma.supportSurvey.count({ where }),
      this.prisma.supportSurvey.aggregate({
        where,
        _avg: { rating: true },
      }),
      this.prisma.supportSurvey.groupBy({
        by: ['rating'],
        where: {
          ...where,
          rating: { not: null },
        },
        _count: { rating: true },
      }),
    ]);

    return {
      total,
      averageRating: averageRating._avg.rating || 0,
      ratingsDistribution: ratings.reduce((acc, r) => {
        if (r.rating !== null) {
          acc[r.rating] = r._count.rating;
        }
        return acc;
      }, {} as Record<number, number>),
    };
  }

  // Obtener todas las encuestas completadas (para el dashboard)
  async getAllSurveys(supportUserId?: string) {
    // Solo obtener encuestas completadas (rating no null y mayor a 0)
    const where = supportUserId 
      ? { 
          supportUserId,
          rating: { not: null },
        }
      : { 
          rating: { not: null },
        };

    return this.prisma.supportSurvey.findMany({
      where,
      include: {
        session: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        supportUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

