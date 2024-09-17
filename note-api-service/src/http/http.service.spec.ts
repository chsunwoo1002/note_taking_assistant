// http.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from './http.service';
import { HttpService as NestHttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';

describe('HttpService', () => {
  let service: HttpService;
  let nestHttpService: NestHttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HttpService,
        {
          provide: NestHttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<HttpService>(HttpService);
    nestHttpService = module.get<NestHttpService>(NestHttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get', () => {
    it('should make a GET request and return data', async () => {
      // Arrange
      const url = 'https://api.example.com/data';
      const headers = { Authorization: 'Bearer token' };
      const responseData = { message: 'Success' };
      const axiosResponse = {
        data: responseData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      (nestHttpService.get as jest.Mock).mockReturnValue(of(axiosResponse));

      // Act
      const result = await service.get<typeof responseData>(url, headers);

      // Assert
      expect(nestHttpService.get).toHaveBeenCalledWith(url, { headers });
      expect(result).toEqual(responseData);
    });

    it('should handle errors thrown by NestHttpService', async () => {
      // Arrange
      const url = 'https://api.example.com/data';
      const headers = { Authorization: 'Bearer token' };
      const error = new Error('Request failed');

      (nestHttpService.get as jest.Mock).mockReturnValue(
        throwError(() => error),
      );

      // Act & Assert
      await expect(service.get(url, headers)).rejects.toThrow('Request failed');
      expect(nestHttpService.get).toHaveBeenCalledWith(url, { headers });
    });
  });
});
