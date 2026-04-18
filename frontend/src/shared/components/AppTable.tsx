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
    <div className="overflow-x-auto rounded-xl border border-slate-200/60 shadow-sm bg-white">
      <table className="min-w-full divide-y divide-slate-100">
        <thead className="bg-slate-50/50">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className="px-6 py-4 text-start text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500 text-sm">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <svg className="animate-spin h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Loading...</span>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500 text-sm">
                {emptyMessage || 'No data available'}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={keyField ? String(row[keyField]) : index} className="hover:bg-slate-50/50 transition-colors">
                {columns.map((col, i) => (
                  <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
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
