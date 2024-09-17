import { ValidationOptions, ValidateIf } from 'class-validator';

/**
 * check the given value is null
 * @param validationOptions check class-validator documentation
 *
 */
export function IsNullable(validationOptions?: ValidationOptions) {
  return ValidateIf((_object, value) => value !== null, validationOptions);
}
