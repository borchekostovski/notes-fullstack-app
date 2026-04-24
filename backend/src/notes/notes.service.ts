import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNoteDto } from './dto/create-note.dto';
import { Note } from './note.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note) private readonly repo: Repository<Note>,
  ) {}

  findAll(): Promise<Note[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  create(dto: CreateNoteDto): Promise<Note> {
    return this.repo.save(this.repo.create(dto));
  }

  async remove(id: string): Promise<void> {
    const result = await this.repo.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Note ${id} not found`);
    }
  }
}
