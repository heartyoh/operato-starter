'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Field } from '@/types/form';
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

export default function EntityListPage({
  params,
}: {
  params: Promise<{ entity: string }>;
}) {
  const { entity } = use(params);
  const router = useRouter();

  const [schema, setSchema] = useState<Field[] | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [schemaRes, itemsRes] = await Promise.all([
        apiClient.get<{ schema: Field[] }>(`/schema/${entity}`),
        apiClient.get<any[]>(`/${entity}`),
      ]);
      setSchema(schemaRes.schema);
      setItems(itemsRes);
    } catch (err) {
      console.error(`Failed to fetch data for ${entity}`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [entity]);

  const handleDelete = async (id: string) => {
    if (!confirm(`Delete ${entity} #${id}?`)) return;
    try {
      await apiClient.delete(`/${entity}/${id}`);
      fetchAll();
    } catch (err) {
      console.error(`Failed to delete ${entity} #${id}`, err);
      alert(`Failed to delete ${entity}`);
    }
  };

  const columnHelper = createColumnHelper<any>();
  const columns: ColumnDef<any, any>[] = schema
    ? schema.map((field) =>
        columnHelper.accessor(field.name, {
          header: () => <span>{field.label}</span>,
          cell: (info) => info.getValue(),
          enableSorting: true,
        })
      )
    : [];

  columns.push(
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="space-x-2">
          <Link href={`/entities/${entity}/${row.original.id}/edit`}>
            <Button size="sm" variant="secondary">
              Edit
            </Button>
          </Link>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDelete(row.original.id)}
          >
            Delete
          </Button>
        </div>
      ),
    })
  );

  const table = useReactTable({
    data: items,
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
        <h1 className="text-2xl font-semibold capitalize text-gray-900 dark:text-gray-100">
          {entity} List
        </h1>
        <Link href={`/entities/${entity}/create`}>
          <Button variant="default">+ New {entity}</Button>
        </Link>
      </div>

      <div className="flex mb-4">
        <Input
          placeholder="Search..."
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

      {!loading && schema && (
        <>
          {table.getRowModel().rows.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400 border rounded-md border-gray-300 dark:border-gray-600">
              No records found for this entity.
            </div>
          ) : (
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
        </>
      )}
    </main>
  );
}
