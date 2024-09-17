import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { plainToInstance, ClassConstructor } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationService {
  async transformAndValidate<T extends object>(
    cls: ClassConstructor<T>,
    plain: object,
  ): Promise<T> {
    const instance = plainToInstance(cls, plain);
    const errors = await validate(instance);

    if (errors.length > 0) {
      const formattedErrors = errors.map((err) => ({
        property: err.property,
        constraints: err.constraints,
      }));
      throw new UnprocessableEntityException(formattedErrors);
    }
    return instance;
  }
}
