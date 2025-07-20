'use client';

import { useEffect, useState } from 'react';
import DynamicForm from '@/components/dynamic-form';
import { apiFetch } from '@/lib/api';
import { Field } from '@/types/form';

const ENTITIES = ['User', 'Product'];

export default function FormAIPage() {
  const [entity, setEntity] = useState<string>('User');
  const [schema, setSchema] = useState<Field[] | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSchema = async (entityName: string) => {
    setLoading(true);
    try {
      const result = await apiFetch<Field[]>(`/schema?entity=${entityName}`);
      setSchema(result);
    } catch (err) {
      console.error('Failed to load schema', err);
      setSchema(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchema(entity);
  }, [entity]);

  const handleSubmit = (data: Record<string, any>) => {
    console.log(`Submitted form for entity "${entity}":`, data);
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <main className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">AI Dynamic Form</h1>
      <div>
        <label className="block mb-2 font-medium">Select Entity</label>
        <select
          value={entity}
          onChange={(e) => setEntity(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
        >
          {ENTITIES.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </div>
      {loading && <p>Loading schema...</p>}
      {schema && <DynamicForm schema={schema} onSubmit={handleSubmit} />}
    </main>
  );
}
