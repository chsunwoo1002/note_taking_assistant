import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { FindNoteDto } from './dto/find-note.dto';
import { FindSummaryDto } from './dto/find-summary.dto';
import { CreateDocumentDto } from './dto/create-document.dto';
import { FindDocumentDto } from './dto/find-document.dto';
import { CreateSummaryDto } from './dto/create-summary.dto';
import { User } from 'src/auth/decorators/user.decorator';
import { AuthenticatedUserDto } from 'src/auth/dto/authenticated-user.dto';
import { CreateContentDto } from './dto/create-content.dto';
import { FindContentsDto } from './dto/find-content.dto';
import { BaseNoteDto } from './dto/base-note.dto';
import { DeleteContentDto } from './dto/delete-note-content.dto';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  findAllNotes(@User() user: AuthenticatedUserDto) {
    return this.notesService.findAllNotes(user);
  }

  @Post()
  createNote(
    @User() user: AuthenticatedUserDto,
    @Body() createNoteDto: CreateNoteDto,
  ) {
    return this.notesService.createNote(user, createNoteDto);
  }

  @Get('/:noteId')
  findOneNote(@Param() findNoteDto: FindNoteDto) {
    return this.notesService.findOneNote(findNoteDto);
  }

  @Post(':noteId/summary')
  createSummary(@Param() createSummaryDto: CreateSummaryDto) {
    return this.notesService.createSummary(createSummaryDto);
  }

  @Get('/:noteId/summary')
  findOneSummary(@Param() findSummaryDto: FindSummaryDto) {
    return this.notesService.findOneSummary(findSummaryDto);
  }

  @Post('/:noteId/document')
  createDocument(@Param() createDocumentDto: CreateDocumentDto) {
    return this.notesService.createDocument(createDocumentDto);
  }

  @Get('/:noteId/document')
  findOneDocument(@Param() findDocumentDto: FindDocumentDto) {
    return this.notesService.findOneDocument(findDocumentDto);
  }

  @Post('/:noteId/content')
  createContent(
    @Param() baseNoteDto: BaseNoteDto,
    @Body() createContentDto: CreateContentDto,
  ) {
    return this.notesService.createContent(baseNoteDto, createContentDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/content/:contentId')
  deleteContent(@Param() deleteContentDto: DeleteContentDto) {
    return this.notesService.deleteContent(deleteContentDto);
  }

  @Get('/:noteId/content')
  findAllContents(@Param() findContentsDto: FindContentsDto) {
    return this.notesService.findAllContents(findContentsDto);
  }
}
