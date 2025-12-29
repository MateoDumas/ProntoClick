import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { JwtAuthGuard } from '../common/jwt.guard';

@Controller('recommendations')
export class RecommendationsController {
  constructor(private recommendationsService: RecommendationsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getRecommendations(@Request() req, @Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 10;
    return this.recommendationsService.getRecommendations(req.user.id, limitNum);
  }

  @Get('trending')
  async getTrending(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 10;
    return this.recommendationsService.getTrending(limitNum);
  }
}

