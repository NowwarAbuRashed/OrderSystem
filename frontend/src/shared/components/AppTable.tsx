import { ReactNode } from 'react';

export type Column<T> = {
  header: string;
  accessor: (item: T) => ReactNode;
};

export type Props<T> = {
  columns: Column<T>[];
  data: T[];
  keyField?: keyof T;
  isLoading?: boolean;
  emptyMessage?: string;
};

export function AppTable<T>({ columns, data, keyField, isLoading, emptyMessage }: Props<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 bg-white">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-slate-500 text-sm">
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-slate-500 text-sm">
                {emptyMessage || 'No data available'}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={keyField ? String(row[keyField]) : index} className="hover:bg-slate-50 transition-colors">
                {columns.map((col, i) => (
                  <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {col.accessor(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
