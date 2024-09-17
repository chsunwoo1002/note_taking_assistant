import { Global, Module } from '@nestjs/common';
import { HttpService } from './http.service';
import { HttpModule as NestHttpModule } from '@nestjs/axios';

@Global()
@Module({
  imports: [NestHttpModule],
  providers: [HttpService],
  exports: [HttpService],
})
export class HttpModule {}
