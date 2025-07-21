'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Field } from '@/types/form';
import { Button, Input } from '@ui';

export default function EntitySchemaPage({
  params,
}: {
  params: Promise<{ entity: string }>;
}) {
  const { entity } = use(params);
  const router = useRouter();

  const [schema, setSchema] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSchema = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<{ schema: Field[] }>(
        `/schema/${entity}`
      );
      setSchema(response.schema);
    } catch (err) {
      console.error(`Failed to fetch schema for ${entity}`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchema();
  }, [entity]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClient.post('/schema', {
        entity,
        schema,
      });
      alert('Schema saved successfully!');
      router.push(`/entities/${entity}/list`);
    } catch (err) {
      console.error('Failed to save schema', err);
      alert('Failed to save schema');
    } finally {
      setSaving(false);
    }
  };

  const addField = () => {
    const newField: Field = {
      name: `field_${schema.length + 1}`,
      label: `Field ${schema.length + 1}`,
      type: 'text',
      required: false,
    };
    setSchema([...schema, newField]);
  };

  const updateField = (index: number, field: Field) => {
    const newSchema = [...schema];
    newSchema[index] = field;
    setSchema(newSchema);
  };

  const removeField = (index: number) => {
    setSchema(schema.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <main className="p-8">
        <p>Loading schema...</p>
      </main>
    );
  }

  return (
    <main className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold capitalize">
          Schema for {entity}
        </h1>
        <div className="space-x-2">
          <Button variant="secondary" onClick={() => router.back()}>
            Back
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Schema'}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {schema.map((field, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Field {index + 1}</h3>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => removeField(index)}
              >
                Remove
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  value={field.name}
                  onChange={(e) =>
                    updateField(index, { ...field, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Label</label>
                <Input
                  value={field.label}
                  onChange={(e) =>
                    updateField(index, { ...field, label: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={field.type}
                  onChange={(e) =>
                    updateField(index, {
                      ...field,
                      type: e.target.value as Field['type'],
                    })
                  }
                  className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value="text">Text</option>
                  <option value="email">Email</option>
                  <option value="number">Number</option>
                  <option value="textarea">Textarea</option>
                  <option value="checkbox">Checkbox</option>
                  <option value="datetime">DateTime</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`required-${index}`}
                checked={field.required}
                onChange={(e) =>
                  updateField(index, { ...field, required: e.target.checked })
                }
                className="rounded"
              />
              <label htmlFor={`required-${index}`} className="text-sm">
                Required
              </label>
            </div>
          </div>
        ))}

        <Button onClick={addField} variant="secondary">
          + Add Field
        </Button>
      </div>
    </main>
  );
}
