import { Controller, Get, Post, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../common/jwt.guard';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get()
  async getUserReports(@Request() req) {
    return this.reportsService.getUserReports(req.user.id);
  }

  @Get(':id')
  async getReportById(@Request() req, @Param('id') id: string) {
    return this.reportsService.getReportById(id, req.user.id);
  }

  @Post()
  async createReport(
    @Request() req,
    @Body() body: { orderId: string; type: string; reason: string; description?: string },
  ) {
    return this.reportsService.createReport(req.user.id, body);
  }
}

