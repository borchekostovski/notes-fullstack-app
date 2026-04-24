import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type Redis from 'ioredis';
import { Repository } from 'typeorm';
import { REDIS } from '../cache/cache.module';
import { CreateNoteDto } from './dto/create-note.dto';
import { Note } from './note.entity';

const LIST_CACHE_KEY = 'notes:all';
const LIST_CACHE_TTL = 60; // seconds

@Injectable()
export class NotesService {
  private readonly logger = new Logger(NotesService.name);

  constructor(
    @InjectRepository(Note) private readonly repo: Repository<Note>,
    @Inject(REDIS) private readonly redis: Redis,
  ) {}

  async findAll(): Promise<Note[]> {
    const cached = await this.safeGet(LIST_CACHE_KEY);
    if (cached) return JSON.parse(cached);

    const notes = await this.repo.find({ order: { createdAt: 'DESC' } });
    await this.safeSet(LIST_CACHE_KEY, JSON.stringify(notes), LIST_CACHE_TTL);
    return notes;
  }

  async create(dto: CreateNoteDto): Promise<Note> {
    const note = await this.repo.save(this.repo.create(dto));
    await this.invalidate();
    return note;
  }

  async remove(id: string): Promise<void> {
    const result = await this.repo.delete(id);
    if (!result.affected) throw new NotFoundException(`Note ${id} not found`);
    await this.invalidate();
  }

  private async invalidate() {
    try {
      await this.redis.del(LIST_CACHE_KEY);
    } catch (err) {
      // Redis is a cache, not the source of truth — never block writes on it.
      this.logger.warn(`cache invalidate failed: ${(err as Error).message}`);
    }
  }

  private async safeGet(key: string): Promise<string | null> {
    try {
      return await this.redis.get(key);
    } catch (err) {
      this.logger.warn(`cache read failed: ${(err as Error).message}`);
      return null;
    }
  }

  private async safeSet(key: string, value: string, ttl: number) {
    try {
      await this.redis.set(key, value, 'EX', ttl);
    } catch (err) {
      this.logger.warn(`cache write failed: ${(err as Error).message}`);
    }
  }
}
