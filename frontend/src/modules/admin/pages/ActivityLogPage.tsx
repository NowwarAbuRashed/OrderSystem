import { useState } from 'react';
import { useAdminActivityQuery } from '../hooks/useAdmin';
import { useI18n } from '../../../app/i18n/i18n-context';
import { PageHeader } from '../../../shared/components/PageHeader';
import { LoadingBlock } from '../../../shared/components/LoadingBlock';
import { Activity, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';

export function AdminActivityLogPage() {
  const { t } = useI18n();
  const [entityFilter, setEntityFilter] = useState('');

  const { data: logs, isLoading, isError } = useAdminActivityQuery({
    count: 100,
    entityType: entityFilter || undefined
  });

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t.admin?.activityLog || 'System Activity Log'} 
        description={t.admin?.activityLogDesc || 'Audit trail of important system actions'} 
      />

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-100 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center space-x-3 text-sm text-neutral-600">
          <Activity className="w-5 h-5 text-neutral-400" />
          <span>Monitoring <strong>{logs?.length || 0}</strong> recent actions</span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="pl-9 pr-8 py-2 text-sm border-neutral-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white"
            >
              <option value="">All Entities</option>
              <option value="Order">Orders</option>
              <option value="Product">Products</option>
              <option value="User">Users</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <LoadingBlock />
      ) : isError ? (
        <div className="text-center py-10 text-red-500">Failed to load activity logs.</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-neutral-50 text-neutral-600 border-b border-neutral-100">
                <tr>
                  <th className="px-6 py-4 font-medium">Timestamp</th>
                  <th className="px-6 py-4 font-medium">Action</th>
                  <th className="px-6 py-4 font-medium">Entity</th>
                  <th className="px-6 py-4 font-medium">User ID</th>
                  <th className="px-6 py-4 font-medium max-w-xs">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {logs?.map((log: any) => (
                  <tr key={log.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-neutral-500">
                      {format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700 border border-primary-100">
                        {log.actionType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-neutral-900">
                      {log.entityType} <span className="text-neutral-400 font-normal">#{log.entityId}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {log.performedByUserId ? (
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center text-xs text-neutral-600 mr-2 uppercase">
                            {log.performedByUser?.fullName?.charAt(0) || 'U'}
                          </div>
                          <span className="text-neutral-600">
                            {log.performedByUser?.fullName || `ID: ${log.performedByUserId}`}
                          </span>
                        </div>
                      ) : (
                        <span className="text-neutral-400 italic">System</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-neutral-500 font-mono overflow-hidden">
                      <div className="max-w-xs truncate" title={log.details}>
                        {log.details.length > 50 ? log.details.substring(0, 50) + '...' : log.details}
                      </div>
                    </td>
                  </tr>
                ))}
                {(!logs || logs.length === 0) && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                      No activity logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
