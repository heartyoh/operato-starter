'use client';

import { useState } from 'react';
import DynamicForm from '@/components/dynamic-form';
import { apiFetch } from '@/lib/api';
import { Field } from '@/types/form';
import { Button, Input } from '@ui';

export default function SchemaDesignerPage() {
  const [fields, setFields] = useState<Field[]>([]);
  const [entityName, setEntityName] = useState('');

  // Field editor state
  const [name, setName] = useState('');
  const [label, setLabel] = useState('');
  const [type, setType] = useState<'text' | 'number' | 'email'>('text');
  const [required, setRequired] = useState(false);
  const [min, setMin] = useState<string>('');
  const [max, setMax] = useState<string>('');
  const [pattern, setPattern] = useState('');
  const [message, setMessage] = useState('');

  const resetFieldEditor = () => {
    setName('');
    setLabel('');
    setType('text');
    setRequired(false);
    setMin('');
    setMax('');
    setPattern('');
    setMessage('');
  };

  const addField = () => {
    if (!name || !label) return;

    const validation: Field['validation'] = {};
    if (min) validation.min = Number(min);
    if (max) validation.max = Number(max);
    if (pattern) validation.pattern = pattern;
    if (message) validation.message = message;

    setFields((prev) => [
      ...prev,
      {
        name,
        label,
        type,
        required,
        validation: Object.keys(validation).length > 0 ? validation : undefined,
      },
    ]);

    resetFieldEditor();
  };

  const saveSchema = async () => {
    if (!entityName) {
      alert('Entity name is required');
      return;
    }

    try {
      await apiFetch('/schema', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity: entityName, schema: fields }),
      });
      alert(`Schema for "${entityName}" saved.`);
    } catch (err) {
      console.error(err);
      alert('Failed to save schema');
    }
  };

  const handleSubmit = (data: Record<string, any>) => {
    console.log('Preview submitted data:', data);
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Schema Designer</h1>

      {/* Entity name */}
      <Input
        placeholder="Entity Name"
        value={entityName}
        onChange={(e) => setEntityName(e.target.value)}
        className="max-w-sm"
      />

      {/* Field editor */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end border rounded-md p-4 bg-gray-50">
        <Input
          placeholder="Field Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="Field Label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <select
          value={type}
          onChange={(e) =>
            setType(e.target.value as 'text' | 'number' | 'email')
          }
          className="border border-gray-300 rounded-md p-2"
        >
          <option value="text">Text</option>
          <option value="number">Number</option>
          <option value="email">Email</option>
        </select>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={required}
            onChange={(e) => setRequired(e.target.checked)}
          />
          <span>Required</span>
        </label>
        <Input
          placeholder="Min (optional)"
          value={min}
          onChange={(e) => setMin(e.target.value)}
        />
        <Input
          placeholder="Max (optional)"
          value={max}
          onChange={(e) => setMax(e.target.value)}
        />
        <Input
          placeholder="Pattern (optional)"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
        />
        <Input
          placeholder="Custom message (optional)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="md:col-span-2 lg:col-span-3"
        />
        <Button onClick={addField} className="w-full">
          Add Field
        </Button>
      </div>

      {/* Fields preview */}
      {fields.length > 0 && (
        <div className="space-y-4 border-t pt-4">
          <h2 className="text-xl font-semibold">Form Preview</h2>
          <DynamicForm schema={fields} onSubmit={handleSubmit} />
          <Button onClick={saveSchema} variant="default" className="w-full">
            Save Schema Definition
          </Button>
        </div>
      )}
    </main>
  );
}
