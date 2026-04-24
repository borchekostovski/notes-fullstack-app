import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { REDIS } from '../cache/cache.module';
import { Note } from './note.entity';
import { NotesService } from './notes.service';

describe('NotesService', () => {
  let service: NotesService;

  const repo = {
    find: jest.fn(),
    create: jest.fn((x) => x),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const redis = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      providers: [
        NotesService,
        { provide: getRepositoryToken(Note), useValue: repo },
        { provide: REDIS, useValue: redis },
      ],
    }).compile();

    service = module.get(NotesService);
  });

  it('returns the cached payload on a cache hit', async () => {
    const cached = [{ id: '1', title: 't', content: 'c', createdAt: new Date().toISOString() }];
    redis.get.mockResolvedValue(JSON.stringify(cached));

    const result = await service.findAll();

    expect(result).toEqual(cached);
    expect(repo.find).not.toHaveBeenCalled();
  });

  it('falls back to the db and populates cache on a miss', async () => {
    redis.get.mockResolvedValue(null);
    const rows = [{ id: '1', title: 't', content: 'c', createdAt: new Date() }];
    repo.find.mockResolvedValue(rows);

    const result = await service.findAll();

    expect(result).toBe(rows);
    expect(redis.set).toHaveBeenCalledWith('notes:all', expect.any(String), 'EX', 60);
  });

  it('invalidates the list cache after create', async () => {
    repo.save.mockResolvedValue({ id: '1', title: 't', content: 'c', createdAt: new Date() });

    await service.create({ title: 't', content: 'c' });

    expect(redis.del).toHaveBeenCalledWith('notes:all');
  });

  it('invalidates the list cache after delete', async () => {
    repo.delete.mockResolvedValue({ affected: 1 });

    await service.remove('some-id');

    expect(redis.del).toHaveBeenCalledWith('notes:all');
  });

  it('throws NotFoundException when deleting a missing note', async () => {
    repo.delete.mockResolvedValue({ affected: 0 });

    await expect(service.remove('missing')).rejects.toThrow(/not found/i);
  });
});
