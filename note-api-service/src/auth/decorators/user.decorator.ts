import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedUserDto } from '../dto/authenticated-user.dto';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthenticatedUserDto => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
