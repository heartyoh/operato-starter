'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Button, Input } from '@ui';
import Skeleton from '@/components/skeleton';
import Link from 'next/link';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnDef,
} from '@tanstack/react-table';

export default function EntitiesDirectoryPage() {
  const router = useRouter();

  const [entities, setEntities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newEntityName, setNewEntityName] = useState('');

  const fetchEntities = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<string[]>('/entities');
      // 문자열 배열을 객체 배열로 변환
      const entitiesWithNames = data.map((name) => ({
        id: name,
        name,
        description: `Entity for managing ${name}`,
        createdAt: new Date().toISOString(),
      }));
      setEntities(entitiesWithNames);
    } catch (err) {
      console.error('Failed to fetch entities', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntityName.trim()) return;

    try {
      await apiClient.post('/entities', { name: newEntityName.trim() });
      setNewEntityName('');
      setShowCreateForm(false);
      fetchEntities();
    } catch (err) {
      console.error('Failed to create entity', err);
      alert('Failed to create entity');
    }
  };

  const handleDelete = async (name: string) => {
    if (!confirm(`Delete entity "${name}"?`)) return;
    try {
      await apiClient.delete(`/entities/${name}`);
      fetchEntities();
    } catch (err) {
      console.error('Failed to delete entity', err);
      alert('Delete failed');
    }
  };

  useEffect(() => {
    fetchEntities();
  }, []);

  const columnHelper = createColumnHelper<any>();
  const columns: ColumnDef<any, any>[] = [
    columnHelper.accessor('name', {
      header: 'Entity Name',
      cell: ({ row }) => (
        <Link
          href={`/entities/${row.original.name}/list`}
          className="capitalize text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          {row.original.name}
        </Link>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor('description', {
      header: 'Description',
      cell: (info) => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created At',
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
      enableSorting: true,
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="space-x-2">
          <Link href={`/entities/${row.original.name}/schema`}>
            <Button size="sm" variant="secondary">
              Schema
            </Button>
          </Link>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDelete(row.original.name)}
          >
            Delete
          </Button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: entities,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    globalFilterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      return String(value)
        .toLowerCase()
        .includes(String(filterValue).toLowerCase());
    },
  });

  return (
    <main className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Registered Entities
        </h1>
        <Button onClick={() => setShowCreateForm(true)}>+ New Entity</Button>
      </div>

      {showCreateForm && (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label
                htmlFor="entityName"
                className="block text-sm font-medium mb-1"
              >
                Entity Name
              </label>
              <Input
                id="entityName"
                type="text"
                value={newEntityName}
                onChange={(e) => setNewEntityName(e.target.value)}
                placeholder="Enter entity name..."
                autoFocus
              />
            </div>
            <div className="flex space-x-2">
              <Button type="submit" disabled={!newEntityName.trim()}>
                Create Entity
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewEntityName('');
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="flex mb-4">
        <Input
          placeholder="Search entities..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-64 bg-white dark:bg-gray-800 dark:text-gray-100"
        />
      </div>

      {loading && (
        <div className="space-y-2">
          <Skeleton className="h-6 w-1/4" />
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      )}

      {!loading && entities.length === 0 && (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400 border rounded-md border-gray-300 dark:border-gray-600">
          No entities registered yet.
        </div>
      )}

      {!loading && entities.length > 0 && (
        <>
          <div className="overflow-x-auto border rounded-md border-gray-300 dark:border-gray-600">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className="cursor-pointer px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string] ?? null}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-2 text-gray-900 dark:text-gray-100"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div>
              <label className="mr-2 text-sm text-gray-600 dark:text-gray-400">
                Rows per page:
              </label>
              <select
                className="border rounded px-2 py-1 text-sm bg-white dark:bg-gray-800 dark:text-gray-100"
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Page {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount()}
              </div>
              <div className="space-x-2">
                <Button
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
