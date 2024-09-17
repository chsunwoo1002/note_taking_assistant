import { Injectable } from '@nestjs/common';
import { HttpService as NestHttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HttpService {
  constructor(private readonly httpService: NestHttpService) {}

  async get<T>(url: string, headers?: Record<string, string>): Promise<T> {
    const response = await firstValueFrom(
      this.httpService.get<T>(url, { headers }),
    );
    return response.data;
  }
}
