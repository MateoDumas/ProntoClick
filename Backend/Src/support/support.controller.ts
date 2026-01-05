import { Controller, Get, Post, Put, Param, Body, UseGuards, Request } from '@nestjs/common';
import { SupportService } from './support.service';
import { JwtAuthGuard } from '../common/jwt.guard';
import { SupportGuard } from '../common/support.guard';

@Controller('support')
@UseGuards(JwtAuthGuard, SupportGuard)
export class SupportController {
  constructor(private supportService: SupportService) {}

  @Get('dashboard/stats')
  async getDashboardStats() {
    try {
      return await this.supportService.getDashboardStats();
    } catch (error) {
      console.error('[SupportController] Error en getDashboardStats:', error);
      throw error;
    }
  }

  @Get('chats/active')
  async getActiveChats() {
    return this.supportService.getActiveChats();
  }

  @Get('chats/resolved')
  async getResolvedChats() {
    return this.supportService.getResolvedChats();
  }

  @Get('chats/:sessionId')
  async getChatHistory(@Param('sessionId') sessionId: string) {
    return this.supportService.getChatHistory(sessionId);
  }

  @Post('chats/:sessionId/message')
  async sendSupportMessage(
    @Param('sessionId') sessionId: string,
    @Body() body: { content: string },
    @Request() req,
  ) {
    return this.supportService.sendSupportMessage(sessionId, body.content, req.user.id);
  }

  @Get('reports/pending')
  async getPendingReports() {
    return this.supportService.getPendingReports();
  }

  @Get('reports/:reportId')
  async getReportDetails(@Param('reportId') reportId: string) {
    return this.supportService.getReportDetails(reportId);
  }

  @Get('orders/with-reports')
  async getOrdersWithReports() {
    return this.supportService.getOrdersWithReports();
  }

  @Put('reports/:reportId/status')
  async updateReportStatus(
    @Param('reportId') reportId: string,
    @Body() body: { status: string; notes?: string },
  ) {
    return this.supportService.updateReportStatus(reportId, body.status, body.notes);
  }

  @Post('chats/:sessionId/survey')
  async createSurvey(
    @Param('sessionId') sessionId: string,
    @Request() req,
  ) {
    return this.supportService.createSurvey(sessionId, req.user.id);
  }

  @Get('surveys/stats')
  async getSurveyStats(@Request() req) {
    return this.supportService.getSurveyStats(req.user.id);
  }

  @Get('surveys')
  async getAllSurveys(@Request() req) {
    return this.supportService.getAllSurveys(req.user.id);
  }
}

