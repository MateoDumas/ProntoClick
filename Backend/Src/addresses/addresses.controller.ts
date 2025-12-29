import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { JwtAuthGuard } from '../common/jwt.guard';

@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressesController {
  constructor(private addressesService: AddressesService) {}

  @Post()
  async create(@Request() req, @Body() body: {
    label: string;
    street: string;
    city: string;
    zipCode: string;
    notes?: string;
    isDefault?: boolean;
  }) {
    return this.addressesService.create(req.user.id, body);
  }

  @Get()
  async findAll(@Request() req) {
    return this.addressesService.findAll(req.user.id);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    return this.addressesService.findOne(req.user.id, id);
  }

  @Put(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() body: {
      label?: string;
      street?: string;
      city?: string;
      zipCode?: string;
      notes?: string;
      isDefault?: boolean;
    },
  ) {
    return this.addressesService.update(req.user.id, id, body);
  }

  @Delete(':id')
  async delete(@Request() req, @Param('id') id: string) {
    return this.addressesService.delete(req.user.id, id);
  }

  @Put(':id/default')
  async setDefault(@Request() req, @Param('id') id: string) {
    return this.addressesService.setDefault(req.user.id, id);
  }
}

