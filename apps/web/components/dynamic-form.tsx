'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { buildYupSchema } from '@/lib/validation-schema';
import { Field } from '@/types/form';
import { Button, Input } from '@ui';

export default function DynamicForm({
  schema,
  onSubmit,
  initialValues,
}: {
  schema: Field[];
  onSubmit: (data: Record<string, any>) => void;
  initialValues?: Record<string, any>;
}) {
  const validationSchema = buildYupSchema(schema);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: initialValues || {},
    resolver: yupResolver(validationSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {schema.map((field) => (
        <div key={field.name} className="space-y-1">
          <label
            htmlFor={field.name}
            className="block text-sm font-medium text-gray-700"
          >
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <Input id={field.name} type={field.type} {...register(field.name)} />
          {errors[field.name] && (
            <p className="text-sm text-red-500">
              {errors[field.name]?.message as string}
            </p>
          )}
        </div>
      ))}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Saving...' : 'Submit'}
      </Button>
    </form>
  );
}
