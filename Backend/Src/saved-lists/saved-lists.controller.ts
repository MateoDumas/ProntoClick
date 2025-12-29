import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { SavedListsService } from './saved-lists.service';
import { JwtAuthGuard } from '../common/jwt.guard';

@Controller('saved-lists')
export class SavedListsController {
  constructor(private savedListsService: SavedListsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Request() req) {
    return this.savedListsService.findAll(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Request() req, @Param('id') id: string) {
    return this.savedListsService.findOne(req.user.id, id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Request() req, @Body() body: { name: string; description?: string; items: any[] }) {
    return this.savedListsService.create(req.user.id, body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { name?: string; description?: string; items?: any[] },
  ) {
    return this.savedListsService.update(req.user.id, id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Request() req, @Param('id') id: string) {
    await this.savedListsService.delete(req.user.id, id);
    return { message: 'Lista eliminada correctamente' };
  }

  @Post(':id/favorite')
  @UseGuards(JwtAuthGuard)
  async toggleFavorite(@Request() req, @Param('id') id: string) {
    return this.savedListsService.toggleFavorite(req.user.id, id);
  }
}

