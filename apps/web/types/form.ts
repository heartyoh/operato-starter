export type FieldType = 'text' | 'number' | 'email' | 'select' | 'checkbox';

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { label: string; value: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
};
