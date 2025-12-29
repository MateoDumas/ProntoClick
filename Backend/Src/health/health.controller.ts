import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async check() {
    const checks = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      checks: {
        database: await this.checkDatabase(),
        memory: this.checkMemory(),
      },
    };

    const allHealthy = Object.values(checks.checks).every(
      (check: any) => check.status === 'healthy',
    );

    return {
      ...checks,
      status: allHealthy ? 'ok' : 'degraded',
    };
  }

  private async checkDatabase() {
    try {
      const startTime = Date.now();
      await this.prisma.$queryRaw`SELECT 1`;
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      return {
        status: 'healthy',
        responseTime: `${responseTime}ms`,
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private checkMemory() {
    const usage = process.memoryUsage();
    const totalMB = usage.heapTotal / 1024 / 1024;
    const usedMB = usage.heapUsed / 1024 / 1024;
    const freeMB = totalMB - usedMB;

    return {
      status: 'healthy',
      heap: {
        total: `${totalMB.toFixed(2)} MB`,
        used: `${usedMB.toFixed(2)} MB`,
        free: `${freeMB.toFixed(2)} MB`,
        percentage: `${((usedMB / totalMB) * 100).toFixed(2)}%`,
      },
    };
  }
}

