import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { SupportService } from '../support/support.service';
import { JwtAuthGuard } from '../common/jwt.guard';

interface SendMessageDto {
  content: string;
  sessionId?: string;
}

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(
    private chatService: ChatService,
    private supportService: SupportService,
  ) {}

  @Post('sessions')
  async createSession(@Request() req) {
    return this.chatService.createSession(req.user.id);
  }

  @Get('sessions')
  async getUserSessions(@Request() req) {
    return this.chatService.getUserSessions(req.user.id);
  }

  @Get('sessions/:id')
  async getSession(@Request() req, @Param('id') id: string) {
    return this.chatService.getSession(id, req.user.id);
  }

  @Post('messages')
  async sendMessage(@Request() req, @Body() dto: SendMessageDto) {
    return this.chatService.sendMessage(req.user.id, dto);
  }

  @Post('sessions/:id/close')
  async closeSession(@Request() req, @Param('id') id: string) {
    return this.chatService.closeSession(id, req.user.id);
  }

  @Post('sessions/:sessionId/survey')
  async submitSurvey(
    @Param('sessionId') sessionId: string,
    @Body() body: { rating: number; comment?: string },
    @Request() req,
  ) {
    // Verificar que el usuario es el dueño de la sesión
    const session = await this.chatService.getSession(sessionId, req.user.id);
    if (!session) {
      throw new Error('Sesión no encontrada');
    }
    return this.supportService.submitSurvey(sessionId, body.rating, body.comment);
  }
}

