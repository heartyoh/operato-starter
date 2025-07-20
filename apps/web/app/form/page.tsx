'use client';

import DynamicForm from '@/components/dynamic-form';
import { Field } from '@/types/form';

export default function FormPage() {
  const schema: Field[] = [
    { name: 'firstName', label: 'First Name', type: 'text' },
    { name: 'age', label: 'Age', type: 'number' },
    { name: 'email', label: 'Email', type: 'email' },
  ];

  const handleSubmit = (data: Record<string, any>) => {
    console.log('Submitted form data:', data);
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dynamic Form Example</h1>
      <DynamicForm schema={schema} onSubmit={handleSubmit} />
    </main>
  );
}
