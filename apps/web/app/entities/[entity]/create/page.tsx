'use client';

import { use, useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Field } from '@/types/form';
import { useRouter } from 'next/navigation';
import DynamicForm from '@/components/dynamic-form';

export default function EntityCreatePage({
  params,
}: {
  params: Promise<{ entity: string }>;
}) {
  const { entity } = use(params);
  const router = useRouter();

  const [schema, setSchema] = useState<Field[] | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSchema = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<{ schema: Field[] }>(
        `/schema/${entity}`
      );
      setSchema(data.schema);
    } catch (err) {
      console.error(`Failed to load schema for ${entity}`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchema();
  }, [entity]);

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      await apiClient.post(`/${entity}`, data);
      alert(`${entity} created successfully.`);
      router.push(`/entities/${entity}/list`);
    } catch (err) {
      console.error(`Failed to create ${entity}`, err);
      alert(`Failed to create ${entity}`);
    }
  };

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-2xl font-semibold capitalize">Create {entity}</h1>

      {loading && <p>Loading schema...</p>}

      {!loading && schema && (
        <DynamicForm schema={schema} onSubmit={handleSubmit} />
      )}

      {!loading && !schema && (
        <p>No schema found for {entity}. Please define schema first.</p>
      )}
    </main>
  );
}
