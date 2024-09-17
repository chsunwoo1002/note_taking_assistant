import { Test, TestingModule } from '@nestjs/testing';
import { ValidationService } from './validation.service';
import { IsString, IsNumber } from 'class-validator';
import { UnprocessableEntityException } from '@nestjs/common';

export class TestDto {
  @IsString()
  name: string;

  @IsNumber()
  age: number;
}

describe('ValidationService', () => {
  let service: ValidationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ValidationService],
    }).compile();

    service = module.get<ValidationService>(ValidationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should transform and validate a valid object successfully', async () => {
    const plainObject = { name: 'John Doe', age: 30 };

    const result = await service.transformAndValidate(TestDto, plainObject);

    expect(result).toBeInstanceOf(TestDto);
    expect(result.name).toBe('John Doe');
    expect(result.age).toBe(30);
  });

  it('should throw UnprocessableEntityException for invalid data', async () => {
    const plainObject = { name: 123, age: 'thirty' }; // Invalid types

    await expect(
      service.transformAndValidate(TestDto, plainObject),
    ).rejects.toThrow(UnprocessableEntityException);
  });

  it('should provide detailed validation errors', async () => {
    const plainObject = { name: 123, age: 'thirty' }; // Invalid types

    try {
      await service.transformAndValidate(TestDto, plainObject);
    } catch (error) {
      expect(error).toBeInstanceOf(UnprocessableEntityException);
      const response = error.getResponse();

      // Adjust the test to check the 'message' property
      expect(response).toHaveProperty('message');
      expect(response.message).toEqual([
        {
          property: 'name',
          constraints: {
            isString: 'name must be a string',
          },
        },
        {
          property: 'age',
          constraints: {
            isNumber:
              'age must be a number conforming to the specified constraints',
          },
        },
      ]);
    }
  });
});
