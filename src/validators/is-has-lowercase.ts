import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import Validator from './validat-helper';

export function IsHasLowercase(
  // property?: string,
  validationOptions?: ValidationOptions,
) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsHasLowercase',
      target: object.constructor,
      propertyName: propertyName,
      // constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return Validator.isHasLowercase(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `В строке нет строчных букв`;
        },
      },
    });
  };
}
