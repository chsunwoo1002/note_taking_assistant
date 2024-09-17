import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from './database.service';
import { Kysely } from 'kysely';

describe('DatabaseService', () => {
  let service: DatabaseService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue({
              host: 'localhost',
              port: 5432,
              username: 'user',
              password: 'password',
              database: 'testdb',
              ssl: false,
            }),
          },
        },
      ],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a Kysely instance', () => {
    const db = service.getDatabase();
    expect(db).toBeInstanceOf(Kysely);
  });

  it('should use the correct database configuration', () => {
    expect(configService.get).toHaveBeenCalledWith('database');
  });
});
