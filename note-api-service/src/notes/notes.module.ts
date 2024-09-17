import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { DatabaseModule } from '../database/database.module';
import { NotesRepository } from './notes.repository';
import { ContentGenerationModule } from '../content-generation/content-generation.module';
import { ContentGenerationService } from '../content-generation/content-generation.service';

@Module({
  imports: [DatabaseModule, ContentGenerationModule],
  controllers: [NotesController],
  providers: [NotesService, NotesRepository, ContentGenerationService],
})
export class NotesModule {}
