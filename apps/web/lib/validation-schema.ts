import * as yup from 'yup';
import { Field } from '@/types/form';

export function buildYupSchema(schema: Field[]): yup.ObjectSchema<any> {
  const shape: Record<string, any> = {};

  for (const field of schema) {
    let validator: any;

    // Base type
    if (field.type === 'email' || field.validation?.pattern === 'email') {
      validator = yup
        .string()
        .email(field.validation?.message || 'Invalid email');
    } else if (field.type === 'number') {
      validator = yup.number().typeError(`${field.label} must be a number`);
    } else {
      validator = yup.string();
    }

    // Required
    if (field.required) {
      validator = validator.required(`${field.label} is required`);
    }

    // Min/Max
    if (field.validation?.min !== undefined) {
      validator = validator.min(
        field.validation.min,
        `${field.label} must be >= ${field.validation.min}`
      );
    }
    if (field.validation?.max !== undefined) {
      validator = validator.max(
        field.validation.max,
        `${field.label} must be <= ${field.validation.max}`
      );
    }

    // Regex pattern (optional)
    if (field.validation?.pattern && field.validation.pattern !== 'email') {
      validator = validator.matches(
        new RegExp(field.validation.pattern),
        field.validation?.message || 'Invalid format'
      );
    }

    shape[field.name] = validator;
  }

  return yup.object().shape(shape);
}
