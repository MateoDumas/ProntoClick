import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ScheduledOrdersService } from './scheduled-orders.service';
import { JwtAuthGuard } from '../common/jwt.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { CancelOrderDto } from './dto/cancel-order.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(
    private ordersService: OrdersService,
    private scheduledOrdersService: ScheduledOrdersService,
  ) {}

  @Post()
  async create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(req.user.id, createOrderDto);
  }

  @Get()
  async findAll(@Request() req) {
    return this.ordersService.findAll(req.user.id);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    return this.ordersService.findOne(id, req.user.id);
  }

  @Post(':id/status')
  async updateStatus(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return this.ordersService.updateStatus(id, req.user.id, body.status);
  }

  @Get('scheduled')
  async getScheduledOrders(@Request() req) {
    return this.scheduledOrdersService.getScheduledOrders(req.user.id);
  }

  @Delete('scheduled/:id')
  async cancelScheduledOrder(@Request() req, @Param('id') id: string) {
    return this.scheduledOrdersService.cancelScheduledOrder(id, req.user.id);
  }

  @Post(':id/cancel')
  async cancelOrder(
    @Request() req,
    @Param('id') id: string,
    @Body() cancelOrderDto: CancelOrderDto,
  ) {
    return this.ordersService.cancelOrder(id, req.user.id, cancelOrderDto);
  }
}

