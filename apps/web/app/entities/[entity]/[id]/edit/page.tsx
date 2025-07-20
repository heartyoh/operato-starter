'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Field } from '@/types/form';
import DynamicForm from '@/components/dynamic-form';

export default function EntityEditPage({
  params,
}: {
  params: Promise<{ entity: string; id: string }>;
}) {
  const { entity, id } = use(params);
  const router = useRouter();

  const [schema, setSchema] = useState<Field[] | null>(null);
  const [record, setRecord] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [schemaRes, recordRes] = await Promise.all([
        apiClient.get<{ schema: Field[] }>(`/schema/${entity}`),
        apiClient.get<Record<string, any>>(`/${entity}/${id}`),
      ]);
      setSchema(schemaRes.schema);
      setRecord(recordRes);
    } catch (err) {
      console.error(`Failed to load data for ${entity} #${id}`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [entity, id]);

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      await apiClient.put(`/${entity}/${id}`, data);
      alert(`${entity} updated successfully.`);
      router.push(`/entities/${entity}/list`);
    } catch (err) {
      console.error(`Failed to update ${entity}`, err);
      alert(`Failed to update ${entity}`);
    }
  };

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-2xl font-semibold capitalize">
        Edit {entity} #{id}
      </h1>

      {loading && <p>Loading...</p>}

      {!loading && schema && record && (
        <DynamicForm
          schema={schema}
          initialValues={record}
          onSubmit={handleSubmit}
        />
      )}

      {!loading && (!schema || !record) && (
        <p>Unable to load schema or record. Please try again later.</p>
      )}
    </main>
  );
}
