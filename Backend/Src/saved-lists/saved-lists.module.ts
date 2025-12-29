import { Module } from '@nestjs/common';
import { SavedListsService } from './saved-lists.service';
import { SavedListsController } from './saved-lists.controller';
import { PrismaModule } from '../Prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SavedListsController],
  providers: [SavedListsService],
  exports: [SavedListsService],
})
export class SavedListsModule {}

