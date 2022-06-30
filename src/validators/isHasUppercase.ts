import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import Validator from './validatHelper';

export function IsHasUppercase(
  // property?: string,
  validationOptions?: ValidationOptions,
) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsHasUppercase',
      target: object.constructor,
      propertyName: propertyName,
      // constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return Validator.isHasUppercase(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `В строке нет заглавных букв`;
        },
      },
    });
  };
}
