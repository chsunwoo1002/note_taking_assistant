import { SetMetadata } from '@nestjs/common';
import { Public, IS_PUBLIC_KEY } from './public.decorator';

jest.mock('@nestjs/common', () => ({
  SetMetadata: jest.fn(),
}));

describe('Public Decorator', () => {
  it('should call SetMetadata with correct arguments', () => {
    const mockSetMetadata = SetMetadata as jest.MockedFunction<
      typeof SetMetadata
    >;

    Public();

    expect(mockSetMetadata).toHaveBeenCalledWith(IS_PUBLIC_KEY, true);
  });
});
